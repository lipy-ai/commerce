import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const cartSchema = z.object({
	inventoryId: z.string().uuid(),
	quantity: z.number().min(0).int(),
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");
		const data = await db
			.selectFrom("cart as c")
			.where("c.userId", "=", session?.userId!)
			.leftJoin("storeInventory as si", "si.id", "c.inventoryId")
			.leftJoin("store as s", "si.storeId", "s.id")
			.leftJoin("productVariant as pv", "pv.id", "si.productVariant")
			.leftJoin("product as p", "p.id", "pv.productId")
			.select((eb) => [
				"c.quantity",
				"c.inventoryId",
				"p.id as productId",
				"p.thumbnail",
				"p.title as title",
				"pv.price as maxPrice",
				"si.price as price",
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
				"pv.unit as unit",
				"s.handle as storeHandle",
				"s.name as storeName",
			])
			.execute();

		return c.json(data || []);
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
	});

export { route as cartRoute };
