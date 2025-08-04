import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db";
import type { SUM_TYPE } from "@/db/schema";
import { getStore } from "@/helpers/store";
import { orderCalculator } from "@/lib/orderCalculators";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";

const cartSchema = z.object({
	inventoryId: z.string().uuid(),
	quantity: z.number().min(0).int(),
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");

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
				eb
					.case()
					.when("si.stock", "=", 0)
					.then(false)
					.when("si.stock", "=", -1)
					.then(true)
					.when("si.stock", ">", 0)
					.then(true)
					.else(false)
					.end()
					.as("inStock"),
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
				eb.fn.jsonAgg("items").as("items"),
			])
			.groupBy("s.id")
			.execute();

		let itemsTotal = 0;
		let maxItemsTotal = 0;
		let taxTotal = 0;
		let totalSaved = 0;
		let totalAmount = 0;

		const storesData = await Promise.all(
			groupedStores.map(async ({ id, handle, image, name, items }) => {
				const store = await getStore(id);
				const taxes: Array<{ amount: number; sum: (typeof SUM_TYPE)[number] }> =
					[{ amount: store.gstTax, sum: "percent" }];

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
				const calc = orderCalculator({
					items: formattedItems,
					taxes,
					discounts: [],
				});

				itemsTotal += calc.itemTotalAmount;
				maxItemsTotal += calc.maxItemTotalAmount;
				taxTotal += calc.totalTaxAmount;
				totalSaved += calc.amountSaved;
				totalAmount += calc.totalAmount;

				return {
					storeId: id,
					storeHandle: handle,
					storeImage: image,
					storeName: name,
					storeMinimumOrderValue: store.minimumOrderValue,
					storeTax: calc.totalTaxAmount,
					storeItemsTotal: calc.itemTotalAmount,
					storeMaxItemsTotal: calc.maxItemTotalAmount,
					items,
				};
			}),
		);

		return c.json({
			itemsTotal,
			maxItemsTotal,
			taxTotal,
			totalSaved,
			totalAmount,
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
