import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const schema = z.object({
	unit: z.string(),
	price: z.coerce.number().min(1),
	productId: z.string().uuid(),
	images: z.array(z.string()),
});

export const merchantVariantRoute = new Hono<ServerContext>()
	.post("/", zValidator("json", schema), async (c) => {
		const { unit, price, productId, images } = c.req.valid("json");

		await db
			.insertInto("productVariant")
			.values({
				id: crypto.randomUUID(),
				unit,
				price,
				productId,
				images,
			})
			.execute();

		return c.json({ success: true });
	})
	.patch(
		"/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		zValidator("json", schema),
		async (c) => {
			const { id } = c.req.valid("param");
			const { unit, price, images } = c.req.valid("json");

			await db
				.updateTable("productVariant")
				.set({
					unit,
					price,
					images,
				})
				.where("id", "=", id)
				.execute();

			return c.json({ success: true });
		},
	)
	.delete(
		"/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			const { id } = c.req.valid("param");

			await db.deleteFrom("productVariant").where("id", "=", id).execute();

			return c.json({ success: true });
		},
	);
