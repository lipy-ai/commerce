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
			.where("userId", "=", session?.userId!)
			.leftJoin("storeInventory as s", "s.storeId", "c.inventoryId")
			.leftJoin("store as st", "s.storeId", "st.id")

			.leftJoin("productVariant as pv", "pv.id", "s.productVariant")
			.leftJoin("product as p", "p.id", "pv.productId")
			.select([
				"c.quantity",
				// "p.brand",
				"c.inventoryId",
				"p.id as productId",
				"p.thumbnail",
				"pv.price as variantMaxPrice",
				"s.price as variantPrice",
				"p.title as variantTitle",
				"s.stock as variantStock",
				"pv.unit as variantUnit",
				"st.id as storeId",
				"st.name as storeName",
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
