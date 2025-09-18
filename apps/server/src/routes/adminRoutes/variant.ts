import { Hono } from "hono";
import { z } from "zod";
import { type DBTypes, db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";

const schema = z.object({
	unit: z.string(),
	price: z.coerce.number().min(1),
	productId: z.string().uuid(),
	images: z.array(z.string()),
});

export const adminVariantRoute = new Hono<ServerContext>()
	.get(
		"/:productId",
		zValidator("param", z.object({ productId: z.string().uuid() })),
		zValidator("query", z.object({ storeId: z.string().uuid() })),
		async (c) => {
			const { productId } = c.req.valid("param");
			const { storeId } = c.req.valid("query");
			const inv = await db
				.selectFrom("productVariant as pv")
				.leftJoin("storeInventory as s", (join) =>
					join.onRef("s.variantId", "=", "pv.id").on("s.storeId", "=", storeId),
				)
				.where("pv.productId", "=", productId)

				.selectAll("pv")
				.select((eb) => [eb.fn.toJson("s").as("inventory")])
				.execute();

			return c.json(inv);
		},
	)
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
		"/inventory",
		zValidator(
			"json",
			z.object({
				items: z.array(
					z.object({
						id: z.string().uuid(),
						active: z.boolean(),
						price: z.coerce.number(),
						stock: z.boolean(),
						storeId: z.string().uuid(),
						variantId: z.string().uuid(),
					}),
				),
			}),
		),
		async (c) => {
			const { items } = c.req.valid("json");
			await db
				.insertInto("storeInventory")
				.values(items)
				.onConflict((oc) =>
					oc.column("id").doUpdateSet((eb) => {
						const keys = Object.keys(
							items[0],
						) as (keyof DBTypes["storeInventory"])[];
						return Object.fromEntries(
							keys.map((key) => [key, eb.ref(`excluded.${key}`)]),
						);
					}),
				)
				.execute();
			return c.json({ success: true });
		},
	)
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
