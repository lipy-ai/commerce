import { type DBTypes, db } from "@/db";
import { HTTPError } from "@/lib/exception";
import { idGenerate } from "@/lib/generateId";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";
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
	address: addressSchema.required(),
	deliveryInstruction: z.string().nullable(),
});

const querySchema = z.object({
	view: z.enum(["active", "all"]).default("all"),
});

const getCart = async (userId: string) => {
	return await db
		.selectFrom("cart as c")
		.where("c.userId", "=", userId!)
		.rightJoin("storeInventory as si", "si.id", "c.inventoryId")
		.rightJoin("productVariant as pv", "pv.id", "si.productVariant")
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
	address,
	deliveryInstruction,
	user,
}: {
	cart: Awaited<ReturnType<typeof getCart>>;
	user: ServerContext["Variables"]["user"];
} & Pick<
	z.infer<typeof orderSchema>,
	"stores" | "address" | "deliveryInstruction"
>): Promise<DBTypes["orders"][]> => {
	const orders: DBTypes["orders"][] = [];

	for (const s of stores) {
		let customer = await db
			.selectFrom("customer")
			.where("storeId", "=", s.id)
			.selectAll()
			.executeTakeFirst();
		console.log(customer);
		if (!customer) {
			customer = await db
				.insertInto("customer")
				.values({ id: crypto.randomUUID(), userId: user?.id, storeId: s.id })
				.returningAll()
				.executeTakeFirstOrThrow()
				.catch(() => {
					throw new HTTPError(400, { message: "Failed to create customer" });
				});
		}

		const items: NonNullable<DBTypes["orders"]["items"]> = [];

		const taxes: DBTypes["orders"]["taxes"] = [];
		const discounts: DBTypes["orders"]["discounts"] = [];

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

		let itemTotalAmount = 0;
		let maxItemTotalAmount = 0;
		let totalTaxAmount = 0;
		let totalDiscountAmount = 0;

		for (const t of items) {
			itemTotalAmount = t.qty * t.price + itemTotalAmount;
			maxItemTotalAmount = t.qty * t.maxPrice + maxItemTotalAmount;
		}
		for (const t of taxes || []) {
			totalTaxAmount = totalTaxAmount + t.amount;
			itemTotalAmount = itemTotalAmount + t.amount;
			maxItemTotalAmount = maxItemTotalAmount + t.amount;
		}

		for (const t of discounts || []) {
			totalDiscountAmount = totalDiscountAmount + t.amount;
			itemTotalAmount = itemTotalAmount - t.amount;
			maxItemTotalAmount = maxItemTotalAmount - t.amount;
		}

		orders.push({
			id: idGenerate(),
			pk: crypto.randomUUID(),
			status: "created",
			items,
			taxes,
			discounts,
			currency: "inr",
			storeId: s.id!,
			customerId: customer.id,
			customerDetails: {
				name: user?.name!,
				phone: user?.phoneNumber!,
				email: user?.email!,
				address: address,
			},
			customerInstructions: {
				delivery: deliveryInstruction,
				store: s.instruction,
				attachments: s.attachments,
			},
			paymentMethod: "cod",
			orderedAt: new Date(),
			itemTotalAmount,
			totalAmount: itemTotalAmount + totalTaxAmount - totalDiscountAmount,
			amountSaved: maxItemTotalAmount - itemTotalAmount,
			totalTaxAmount,
			totalDiscountAmount,
			maxItemTotalAmount,
			delivery: null,
			cancelledAt: null,
			refundedAt: null,
			deliveredAt: null,
			deliveryAgentAssignedAt: null,
			timeline: [
				{
					content: "Order was created!",
					userId: user?.id!,
					createdAt: new Date().toISOString(),
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

const route = new Hono<ServerContext>()
	.get("/", zValidator("query", querySchema), async (c) => {
		const session = c.get("session");
		const q = c.req.valid("query");
		const data = await db
			.selectFrom("orders as o")
			.where("o.customerId", "=", session?.userId!)
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
				"o.itemTotalAmount",
				"o.currency",
				"o.status",
				"o.items",
				"o.orderedAt",
				"s.name as storeName",
				"s.image as storeLogo",
				"s.id as storeId",
				"s.address as storeAddress",
				"s.handle as storeHandle",
				"o.customerId",
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
			.where("o.customerId", "=", session?.userId!)
			.where("o.id", "=", id)
			.leftJoin("store as s", "s.id", "o.storeId")
			.selectAll(["o"])
			.select([
				"s.handle as storeHandle",
				"s.name as storeName",
				"s.image as storeLogo",
				"s.address as storeAddress",
				"s.phone as storePhone",
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

		const cart = await getCart(session?.userId!);

		const orders = await generateOrders({ cart, user, ...values });

		await db.insertInto("orders").values(orders).execute();

		await db
			.deleteFrom("cart")
			.where("userId", "=", session?.userId!)
			.execute();

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
			.where("customerId", "=", session?.userId!)
			.set({ status: "cancelled" })
			.execute();
		return c.json({ success: true });
	})
	.post("/custom", zValidator("json", orderSchema), async (c) => {
		const user = c.get("user");
		const values = c.req.valid("json");
		if (!values?.address)
			throw new HTTPError(404, { message: "Address not found!" });

		const orders = await generateOrders({ cart: [], user, ...values });

		await db.insertInto("orders").values(orders).execute();

		for (const ord of orders) {
			c.get("emitter").emit(c, "order:created", ord);
		}
		return c.json({ orders: orders.map((o) => o.id) });
	});

export { route as orderRoute };
