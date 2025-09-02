import { Hono } from "hono";
import { sql, type Transaction } from "kysely";
import { z } from "zod";
import { type Database, type DBTypes, db } from "@/db";
import type { SUM_TYPE } from "@/db/schema";
import { getStore } from "@/helpers/store";
import { getFeedStores } from "@/helpers/storeFeed";
import { couponCalculator } from "@/lib/couponCalculator";
import { HTTPError } from "@/lib/exception";
import { idGenerate } from "@/lib/generateId";
import { formatAmount } from "@/lib/intl";
import { orderCalculator } from "@/lib/orderCalculators";
import { zValidator } from "@/middlewares/validator";
import { firebase_messaging } from "@/services/firebase";
import type { ServerContext } from "@/types";
import { addressSchema } from "./address";

const paramSchema = z.object({
	id: z.string(),
});

const orderSchema = z.object({
	stores: z.array(
		z.object({
			id: z.string().uuid(),
			instruction: z.string(),
			attachments: z.array(z.string()).max(10),
			coupon: z.string().optional(),
		}),
	),
	address: z.object({
		id: z.string().uuid().nullable(),
		...addressSchema.shape,
	}),
	deliveryInstruction: z.string().nullable(),
});

const querySchema = z.object({
	view: z.enum(["active", "all"]).default("all"),
});

const notifyStore = async ({
	storeId,
	id,
	...rest
}: Awaited<ReturnType<typeof generateOrders>>[0]) => {
	const storeDevices = await db
		.selectFrom("storeMember as sm")
		.where("sm.storeId", "=", storeId)
		.where("sm.role", "in", ["admin", "owner", "staff"])
		.leftJoin("devices as d", "d.userId", "sm.userId")
		.where("d.pushToken", "is not", null)
		.selectAll(["d"])
		.orderBy("lastSeenAt", "desc")
		.execute();

	const tokens = storeDevices.map((t) => t.pushToken || "");

	if (tokens.length === 0) {
		return;
	}

	console.log(`sending notification to ${tokens.length} devices`);

	await firebase_messaging
		.sendEachForMulticast({
			android: {
				priority: "high",
				ttl: 30 * 1000,

				notification: {
					channelId: "order",
					sound: "urgent.wav",
					priority: "max",
					visibility: "public",
					icon: "ic_ico",
				},
			},
			notification: {
				title: "New Order",
				body: `You have a new order of amount ${formatAmount("inr", rest.totalAmount || 0)} from ${rest.customerDetails?.name || "customer"}`,
				// imageUrl: "https://partners.lipy.in/logo/ico.png",
			},
			data: {
				// duration: String(60 * 1000),
				// showTimestamp: String(true),
				ongoing: String(true),
				// showChronometer: String(true),
				// chronometerDirection: "down",
				url: `https://partners.lipy.in/pos/order/${id}`,
			},

			apns: {
				headers: {
					"apns-priority": "5",
				},
				payload: {
					aps: {
						sound: {
							name: "urgent.wav",
							critical: true,
							volume: 0.7,
						},
					},
				},
			},
			tokens,
		})
		.then((r) => {
			console.log(r);
			if (r.failureCount === tokens.length) {
				throw new HTTPError(400, { message: "Failed to notify stores!" });
			}
			if (r.failureCount > 0) {
				const failedTokens: string[] = [];
				r.responses.forEach((resp, idx) => {
					if (!resp.success) {
						failedTokens.push(tokens[idx]);
					}
				});
				console.log("List of tokens that caused failures: " + failedTokens);
			}
		});
};

const getCart = async (userId: string, trx: Transaction<Database>) => {
	return await trx
		.selectFrom("cart as c")
		.where("c.userId", "=", userId!)
		.rightJoin("storeInventory as si", "si.id", "c.inventoryId")
		.where("si.stock", "!=", 0)
		.rightJoin("productVariant as pv", "pv.id", "si.variantId")
		.rightJoin("product as p", "p.id", "pv.productId")
		.select((eb) => [
			eb.fn.toJson("c").as("cart"),
			eb.fn.toJson("p").as("product"),
			eb.fn.toJson("pv").as("variant"),
			eb.fn.toJson("si").as("inventory"),
		])
		.execute();
};

const generateOrders = async ({
	stores,
	cart,
	trx,
	address,
	deliveryInstruction,
	user,
}: {
	cart: Awaited<ReturnType<typeof getCart>>;
	user: ServerContext["Variables"]["user"];
	trx: Transaction<Database>;
} & Pick<
	z.infer<typeof orderSchema>,
	"stores" | "address" | "deliveryInstruction"
>): Promise<DBTypes["orders"][]> => {
	const orders: DBTypes["orders"][] = [];

	const nearbyStores = await getFeedStores({
		lat: Number(address.lat),
		lng: Number(address.lng),
	});

	for (const s of stores) {
		let customer = await trx
			.selectFrom("customer")
			.where("storeId", "=", s.id)
			.where("userId", "=", user?.id!)
			.selectAll()
			.executeTakeFirst();

		if (!customer) {
			customer = await trx
				.insertInto("customer")
				.values({ userId: user?.id, storeId: s.id })
				.returningAll()
				.executeTakeFirstOrThrow()
				.catch(() => {
					throw new HTTPError(400, { message: "Failed to create customer" });
				});
		}
		const store = await getStore(s.id);

		const currentStore = nearbyStores.find((store) => store.id === s.id);

		if (!currentStore) continue;

		let deliveryCharge = 0;

		deliveryCharge =
			((Number(currentStore.distance.value) -
				store.freeDeliveryDistance * 1000) *
				store.deliveryChargePerKm) /
			1000;

		if (deliveryCharge < 0) {
			deliveryCharge = 0;
		}
		if (
			Number(currentStore.distance.value) >
			(store.deliveryDistance + 5) * 1000
		) {
			continue;
		}

		const items: NonNullable<DBTypes["orders"]["items"]> = [];

		for (const c of cart) {
			if (c.inventory.storeId === s.id) {
				items.push({
					inventoryId: c.inventory.id,
					variantId: c.variant.id,
					productId: c.product.id!,
					title: c.product.title!,
					thumbnail: c.variant.images?.[0] || c.product.thumbnail!,
					maxPrice: c.variant.price || 0,
					price: c.inventory.price || 0,
					unit: c.variant.unit!,
					qty: c.cart.quantity || 1,
				} satisfies NonNullable<DBTypes["orders"]["items"]>[0]);
			}
		}

		if (items.length === 0 && !s.instruction && s.attachments.length === 0) {
			throw new HTTPError(400, {
				message: "No cart items nor instructions order!",
			});
		}

		const orderValue = items.reduce(
			(acc, item) => acc + item.price * item.qty,
			0,
		);

		const { discounts, deliveryFee } = couponCalculator(
			store.coupons,
			orderValue,
			deliveryCharge,
		);

		const taxes: Array<{
			amount: number;
			sum: (typeof SUM_TYPE)[number];
			name: string;
		}> = [
			{ amount: store.gstTax, sum: "percent", name: "GST" },
			{
				amount: deliveryFee as number,
				sum: "flat",
				name: "Delivery Charge",
			},
		];

		const calcs = orderCalculator({ items, discounts, taxes });

		if (store.minimumOrderValue > calcs.itemTotalAmount) {
			continue;
		}

		orders.push({
			...calcs,
			id: idGenerate(),
			pk: crypto.randomUUID(),
			status: "created",
			items,
			taxes,
			discounts,
			currency: "inr",
			storeId: s.id!,
			userId: customer.userId,
			customerDetails: {
				name: address.name || user?.name!,
				phone: address.phone || user?.phoneNumber!,
				email: user?.email!,
				address: address,
				image: user?.image!,
			},
			customerInstructions: {
				delivery: deliveryInstruction,
				store: s.instruction,
				attachments: s.attachments,
			},
			paymentMethod: "cod",
			orderedAt: new Date(),
			delivery: null,
			canceledAt: null,
			refundedAt: null,
			deliveredAt: null,
			deliveryAgentAssignedAt: null,
			confirmationOtp: idGenerate({ length: 5, alphabet_type: "0-9" }),
			cancelReason: null,
			paidAt: null,
			timeline: [
				{
					content: "Order was created!",
					userId: user?.id!,
					createdAt: new Date().toISOString(),
					status: "created",
				},
			],
		} satisfies NonNullable<DBTypes["orders"]>);
	}

	if (!orders || orders.length === 0) {
		throw new HTTPError(400, {
			message: "Empty order!",
		});
	}

	return orders;
};

const setPrimaryAddress = async (
	trx: Transaction<Database>,
	{ lat, lng, ...address }: z.infer<typeof orderSchema>["address"],
	userId: string,
) => {
	let id = address?.id;

	if (!lng || !lat) {
		throw new HTTPError(400, { message: "Missing lat & lng from address." });
	}

	if (!address.id) {
		const addressId = await trx
			.insertInto("address")
			.values({
				...address,
				id: crypto.randomUUID(),
				location: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`,
			})
			.returning(["id"])
			.executeTakeFirst();

		await trx
			.insertInto("userAddress")
			.values({
				id: addressId?.id!,
				userId: userId!,
			})
			.execute();

		id = addressId?.id!;
	}

	return await trx
		.updateTable("user")
		.where("id", "=", userId!)
		.set({ address: id })
		.executeTakeFirstOrThrow();
};

const route = new Hono<ServerContext>()
	.get("/", zValidator("query", querySchema), async (c) => {
		const session = c.get("session");
		const q = c.req.valid("query");
		const data = await db
			.selectFrom("orders as o")
			.where("o.userId", "=", session?.userId!)
			.$if(q.view === "active", (qb) =>
				qb.where((eb) =>
					eb.or([
						eb("o.status", "in", [
							"created",
							"accepted",
							"out_for_delivery",
							"packed",
							"return_requested",
						]),
					]),
				),
			)
			.leftJoin("store as s", "s.id", "o.storeId")
			.select((eb) => [
				"o.id",
				"o.totalAmount",
				"o.currency",
				"o.status",
				"o.items",
				"o.orderedAt",
				"s.name as storeName",
				"s.image as storeLogo",
				"s.id as storeId",
				"s.address as storeAddress",
				"s.handle as storeHandle",
				"o.userId",
				"o.customerDetails",
				"o.customerInstructions",
				eb.fn.toJson("s").as("store"),
			])
			.orderBy("o.orderedAt", "desc")
			.execute();

		return c.json(data || []);
	})
	.get("/:id", zValidator("param", paramSchema), async (c) => {
		const session = c.get("session");
		const { id } = c.req.valid("param");

		const data = await db
			.selectFrom("orders as o")
			.where("o.userId", "=", session?.userId!)
			.where("o.id", "=", id)
			.leftJoin("store as s", "s.id", "o.storeId")
			.selectAll(["o"])
			.select([
				"s.handle as storeHandle",
				"s.name as storeName",
				"s.image as storeLogo",
				"s.address as storeAddress",
				"s.phone as storePhone",
				"s.payments",
			])

			.executeTakeFirstOrThrow();

		return c.json(data || []);
	})
	.post("/", zValidator("json", orderSchema), async (c) => {
		const session = c.get("session");
		const user = c.get("user");
		const values = c.req.valid("json");

		if (!values.address)
			throw new HTTPError(404, { message: "Address not found!" });

		const orders = await db.transaction().execute(async (trx) => {
			const cart = await getCart(session?.userId!, trx);

			const ordersData = await generateOrders({ cart, user, trx, ...values });

			await trx.insertInto("orders").values(ordersData).execute();
			await trx
				.deleteFrom("cart")
				.where("userId", "=", session?.userId!)
				.execute();
			await setPrimaryAddress(trx, values.address, user?.id!);

			for (const ord of ordersData) {
				await notifyStore(ord);
			}

			return ordersData;
		});

		for (const ord of orders) {
			c.get("emitter").emit(c, "order:created", ord);
		}
		return c.json({ orders: orders.map((o) => o.id) });
	})
	.post("/cancel/:id", zValidator("param", paramSchema), async (c) => {
		const session = c.get("session");
		const { id } = c.req.valid("param");

		await db
			.updateTable("orders")
			.where("id", "=", id)
			.where("userId", "=", session?.userId!)
			.set({ status: "canceled" })
			.execute();
		return c.json({ success: true });
	})
	.post("/custom", zValidator("json", orderSchema), async (c) => {
		const user = c.get("user");
		const values = c.req.valid("json");
		if (!values?.address)
			throw new HTTPError(404, { message: "Address not found!" });

		const orders = await db.transaction().execute(async (trx) => {
			const ordersData = await generateOrders({
				cart: [],
				user,
				trx,
				...values,
			});

			await trx.insertInto("orders").values(ordersData).execute();

			await setPrimaryAddress(trx, values.address, user?.id!);
			return ordersData;
		});

		for (const ord of orders) {
			await notifyStore(ord);

			c.get("emitter").emit(c, "order:created", ord);
		}
		return c.json({ orders: orders.map((o) => o.id) });
	})
	.patch(
		"/:id",
		zValidator("param", paramSchema),
		zValidator(
			"json",
			z.object({
				status: z.enum(["accepted", "canceled"]),
			}),
		),
		async (c) => {
			const { id } = c.req.valid("param");
			const { status } = c.req.valid("json");
			await db
				.updateTable("orders")
				.where("id", "=", id)
				.set({ status: status })
				.execute();
			return c.json({ success: true });
		},
	);

export { route as orderRoute };
