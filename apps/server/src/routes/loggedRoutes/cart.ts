import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db";
import type { SUM_TYPE } from "@/db/schema";
import { getStore } from "@/helpers/store";
import { getFeedStores } from "@/helpers/storeFeed";
import { couponCalculator } from "@/lib/couponCalculator";
import { orderCalculator } from "@/lib/orderCalculators";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";

const cartSchema = z.object({
	inventoryId: z.string().uuid(),
	quantity: z.number().min(0).int(),
});

const deliveryLocationSchema = z.object({
	lat: z.coerce.number(),
	lng: z.coerce.number(),
});
const route = new Hono<ServerContext>()
	.get("/", zValidator("query", deliveryLocationSchema), async (c) => {
		const session = c.get("session");
		const deliveryLocation = c.req.valid("query");

		const cartItemsQuery = db
			.selectFrom("cart as c")
			.where("c.userId", "=", session?.userId!)
			.rightJoin("storeInventory as si", "si.id", "c.inventoryId")
			.where("si.active", "=", true)
			.leftJoin("store as s", "si.storeId", "s.id")
			.rightJoin("productVariant as pv", "pv.id", "si.variantId")
			.rightJoin("product as p", "p.id", "pv.productId")
			.select((eb) => [
				"p.id as productId",
				"p.title",
				"p.thumbnail",
				"pv.price as maxPrice",
				"pv.unit",
				"si.price as price",
				"c.quantity",
				"s.id as storeId",
				"s.handle as storeHandle",
				"si.id as inventoryId",
				"si.inStock as inStock",
			])
			.as("items");

		const groupedStores = await db
			.selectFrom(cartItemsQuery)
			.innerJoin("store as s", "s.id", "items.storeId")
			.select((eb) => [
				"s.id",
				"s.handle",
				"s.image",
				"s.name",
				"s.address",
				eb.fn.jsonAgg("items").as("items"),
			])
			.groupBy("s.id")
			.execute();

		const nearbyShops = await getFeedStores({
			lat: deliveryLocation.lat,
			lng: deliveryLocation.lng,
		}).catch(() => {
			return [];
		});

		const targetStores = groupedStores
			.map((store) => {
				const storeExtraData = nearbyShops.find((nearbyStore) => {
					return nearbyStore.id === store.id;
				});

				return {
					...store,
					canDeliver: !!storeExtraData,
					distanceFromUser: storeExtraData?.distance.value,
					deliveryDistance: storeExtraData?.deliveryDistance,
					freeDeliveryDistance: storeExtraData?.freeDeliveryDistance,
				};
			})
			.filter((s) => s !== null);

		let itemsTotal = 0;
		let maxItemsTotal = 0;
		let taxTotal = 0;
		let totalSaved = 0;
		let totalAmount = 0;
		let totalDeliveryCharge = 0;
		let totalDiscount = 0;

		const storesData = await Promise.all(
			targetStores.map(
				async ({
					id,
					handle,
					image,
					name,
					items,
					distanceFromUser,
					deliveryDistance,
					canDeliver,
				}) => {
					const store = await getStore(id);

					let deliveryCharge = 0;
					let isServiceable = canDeliver;

					if (Number(distanceFromUser) > ((deliveryDistance || 0) + 5) * 1000) {
						isServiceable = false;
					}

					deliveryCharge =
						((distanceFromUser - store.freeDeliveryDistance * 1000) *
							store.deliveryChargePerKm) /
						1000;

					if (deliveryCharge < 0) {
						deliveryCharge = 0;
					}

					const formattedItems = items
						.filter(
							(item: (typeof groupedStores)[number]["items"][number]) =>
								item.inStock === true,
						)
						.map((item) => ({
							price: item.price || 0,
							maxPrice: item.maxPrice || undefined,
							qty: item.quantity || 1,
						}));
					const orderValue = formattedItems.reduce(
						(acc, item) => acc + item.price * item.qty,
						0,
					);

					let { discounts, deliveryFee } = couponCalculator(
						store.coupons,
						orderValue,
						deliveryCharge,
					);

					const taxes: Array<{
						amount: number;
						sum: (typeof SUM_TYPE)[number];
					}> = [
						{ amount: store.gstTax, sum: "percent" },
						{
							amount: deliveryFee as number,
							sum: "flat",
						},
					];

					const calc = orderCalculator({
						items: formattedItems,
						taxes,
						discounts: discounts,
					});
					if (!isServiceable) {
						calc.itemTotalAmount = 0;
						calc.totalAmount = 0;
						calc.maxItemTotalAmount = 0;
						calc.totalTaxAmount = 0;
						calc.amountSaved = 0;
						calc.totalDiscountAmount = 0;
						deliveryFee = 0;
					}

					itemsTotal += calc.itemTotalAmount;
					maxItemsTotal += calc.maxItemTotalAmount;
					taxTotal += calc.totalTaxAmount - (deliveryFee as number);
					totalSaved += calc.amountSaved;
					totalAmount += calc.totalAmount;
					totalDeliveryCharge += deliveryFee as number;
					totalDiscount += calc.totalDiscountAmount;

					return {
						storeId: id,
						storeHandle: handle,
						storeImage: image,
						storeName: name,
						storeMinimumOrderValue: store.minimumOrderValue,
						storeTax: calc.totalTaxAmount - deliveryCharge,
						storeItemsTotal: calc.itemTotalAmount,
						storeMaxItemsTotal: calc.maxItemTotalAmount,
						storDeliveryCharge: deliveryFee,
						storeDistanceFromUser: distanceFromUser / 1000,
						storeIsServiceable: isServiceable,
						storeDiscount: discounts,
						items,
					};
				},
			),
		);

		return c.json({
			itemsTotal,
			maxItemsTotal,
			taxTotal,
			totalSaved,
			totalAmount,
			totalDiscount,
			totalDeliveryCharge,
			store: storesData,
		});
	})
	.get("/basic", async (c) => {
		const userId = c.get("session")?.userId!;

		const result = await db
			.selectFrom("cart")
			.where("userId", "=", userId)
			.select(["inventoryId", "quantity"])
			.execute();

		return c.json(result);
	})
	.patch("/", zValidator("json", cartSchema), async (c) => {
		const session = c.get("session");
		const values = c.req.valid("json");
		if (Number(values.quantity) === 0) {
			await db
				.deleteFrom("cart")
				.where("userId", "=", session?.userId!)
				.where("inventoryId", "=", values.inventoryId)
				.executeTakeFirstOrThrow();

			return c.json({ success: true });
		}

		const result = await db
			.updateTable("cart")
			.where("userId", "=", session?.userId!)
			.where("inventoryId", "=", values.inventoryId)
			.set({
				quantity: values.quantity,
			})
			.executeTakeFirstOrThrow();

		if (Number(result.numUpdatedRows) === 0) {
			await db
				.insertInto("cart")
				.values({
					id: crypto.randomUUID(),
					userId: session?.userId!,
					quantity: values.quantity,
					inventoryId: values.inventoryId,
				})
				.execute();
		}

		return c.json({ success: true });
	})
	.delete("/", async (c) => {
		const session = c.get("session");
		await db
			.deleteFrom("cart")
			.where("userId", "=", session?.userId!)
			.execute();
		return c.json({ success: true });
	})
	.delete(
		"/:shopHandle",
		zValidator("param", z.object({ shopHandle: z.string() })),
		async (c) => {
			const session = c.get("session");
			const { shopHandle } = c.req.valid("param");
			await db
				.deleteFrom("cart")
				.where("userId", "=", session?.userId!)
				.where("inventoryId", "in", () => {
					return db
						.selectFrom("storeInventory")
						.where("storeId", "in", () => {
							return db
								.selectFrom("store")
								.where("handle", "=", shopHandle)
								.select("id");
						})
						.select("id");
				})
				.execute();
			return c.json({ success: true });
		},
	);

export { route as cartRoute };
