import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const cartSchema = z.object({
	variant_id: z.string(),
	quantity: z.number().min(0).int(),
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");
		const data = await db
			.selectFrom("cart as c")
			.where("user_id", "=", session?.userId!)
			.rightJoin("product_variant as pv", "pv.id", "c.variant_id")
			.rightJoin("product as p", "p.id", "pv.product")
			.select([
				"c.quantity",
				"p.brand",
				"pv.price",
				"p.id",
				"c.variant_id",
				"pv.max_price",
				"pv.price",
			])
			.execute();

		return c.json(data || []);
	})
	.patch("/", zValidator("json", cartSchema), async (c) => {
		const session = c.get("session");
		const values = c.req.valid("json");

		if (values.quantity === 0) {
			await db
				.deleteFrom("cart")
				.where("user_id", "=", session?.userId!)
				.where("variant_id", "=", values.variant_id)
				.executeTakeFirstOrThrow();
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
