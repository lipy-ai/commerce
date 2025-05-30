import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const cartSchema = z.object({
	variantId: z.string().uuid(),
	quantity: z.number().min(0).int(),
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");
		const data = await db
			.selectFrom("cart as c")
			.where("userId", "=", session?.userId!)
			.leftJoin("productVariant as pv", "pv.id", "c.variantId")
			.leftJoin("product as p", "p.id", "pv.product")
			.leftJoin("store as s", "s.id", "pv.storeId")
			.select([
				"c.quantity",
				"p.brand",
				"c.variantId",
				"p.id as productId",
				"pv.maxPrice as variantMaxPrice",
				"pv.price as variantPrice",
				"pv.title as varianTitle",
				"pv.stockQty as variantStock",
				"pv.unit as variantUnit",
				"s.id as storeId",
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
				.where("variantId", "=", values.variantId)
				.executeTakeFirstOrThrow();

			return c.json({ success: true });
		}

		const result = await db
			.updateTable("cart")
			.where("userId", "=", session?.userId!)
			.where("variantId", "=", values.variantId)
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
					variantId: values.variantId,
				})
				.execute();
		}

		return c.json({ success: true });
	});

export { route as cartRoute };
