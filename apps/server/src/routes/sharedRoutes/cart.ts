import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const cartSchema = z.object({
	variant_id: z.number(),
	quantity: z.number().min(0).int(),
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");
		const data = await db
			.selectFrom("cart as c")
			.where("user_id", "=", session?.userId!)
			.leftJoin("product_variant as pv", "pv.id", "c.variant_id")
			.leftJoin("product as p", "p.id", "pv.product")
			.select([
				"c.quantity",
				"p.brand",
				"p.id as product_id",
				"p.in_stock as product_in_stock",
				"c.variant_id",
				"pv.max_price as variant_max_price",
				"pv.price as variant_price",
				"pv.title as variant_title",
				"pv.qty as variant_stock",
				"pv.unit as variant_unit",
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
				.where("user_id", "=", session?.userId!)
				.where("variant_id", "=", values.variant_id)
				.executeTakeFirstOrThrow();

			return c.json({ success: true });
		}

		const result = await db
			.updateTable("cart")
			.where("user_id", "=", session?.userId!)
			.where("variant_id", "=", values.variant_id)
			.set({
				quantity: values.quantity,
			})
			.executeTakeFirstOrThrow();

		if (Number(result.numUpdatedRows) === 0) {
			await db
				.insertInto("cart")
				.values({
					id: crypto.randomUUID(),
					user_id: session?.userId!,
					quantity: values.quantity,
					variant_id: values.variant_id,
				})
				.execute();
		}

		return c.json({ success: true });
	});

export { route as cartRoute };
