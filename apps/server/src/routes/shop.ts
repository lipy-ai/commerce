import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres"; // Use 'mysql' or 'sqlite' if needed
import { z } from "zod";

const cartSchema = z.object({
	variantId: z.number(),
	quantity: z.number().min(0).int(),
});

const route = new Hono<ServerContext>()
	/**
	 * Gets All Shops
	 */
	.get("/", async (c) => {
		const d = await db
			.selectFrom("store")
			.where("active", "=", true)
			.selectAll()
			.execute();
		return c.json(d || []);
	})
	.get(
		"/:handle",
		zValidator("param", z.object({ handle: z.string() })),
		async (c) => {
			const { handle } = c.req.valid("param");
			const d = await db
				.selectFrom("store")
				.where("handle", "=", handle)
				.selectAll()
				.executeTakeFirst();

			if (!d) {
				throw new HTTPException(404, { message: "Store not found!" });
			}
			return c.json(d || []);
		},
	)
	.get(
		"/:id/categories",
		zValidator("param", z.object({ id: z.string() })),
		zValidator("query", listZodSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const { limit, page } = c.req.valid("query");
			const offset = limit * (page - 1);

			const limitedProducts = db
				.selectFrom("product as p")
				.select((eb) => [
					"p.id",
					"p.title",
					"p.thumbnail",
					"p.thumbnail",
					"p.price",
					"p.maxPrice",
					"p.category",
					"p.storeId",
					sql`ROW_NUMBER() OVER (PARTITION BY p.category ORDER BY p.id)`.as(
						"rn",
					),
					jsonArrayFrom(
						eb
							.selectFrom("productVariant as pv")
							.select([
								"pv.id",
								"pv.title",
								"pv.price",
								"pv.maxPrice",
								"pv.unit",
								"pv.stockQty",
							])
							.whereRef("pv.product", "=", "p.id"),
					).as("variants"),
				])
				.where("p.storeId", "=", id)
				.groupBy([
					"p.id",
					"p.title",
					"p.thumbnail",
					"p.price",
					"p.maxPrice",
					"p.category",
					"p.storeId",
				])
				.as("limited_products");

			const result = await db
				.selectFrom(limitedProducts)
				.innerJoin("category", "category.id", "limited_products.category")
				.where("limited_products.rn", "<=", 6)
				.select((eb) => [
					"category.id",
					"category.title",

					eb.fn.jsonAgg("limited_products").as("products"),
				])
				.groupBy("category.id")
				.limit(limit)
				.offset(offset)
				.execute();

			return c.json({
				items: result,
				page,
				limit,
				hasMore: result.length === limit,
			});
		},
	);

export { route as shopRoute };
