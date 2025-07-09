import { db } from "@/db";
import { HTTPError } from "@/lib/exception";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { sql } from "kysely";
import { jsonArrayFrom, jsonBuildObject } from "kysely/helpers/postgres"; // Use 'mysql' or 'sqlite' if needed
import { z } from "zod";

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
				throw new HTTPError(404, { message: "Store not found!" });
			}
			return c.json(d || []);
		},
	)
	.get(
		"/:storeHandle/categories",
		zValidator("param", z.object({ storeHandle: z.string() })),
		zValidator("query", listZodSchema),
		async (c) => {
			const { storeHandle } = c.req.valid("param");
			const { limit, page } = c.req.valid("query");
			const offset = limit * (page - 1);

			const r = db
				.selectFrom("storeInventory as si")
				.leftJoin("store as s", "s.id", "si.storeId")
				.where("s.handle", "=", storeHandle)
				.rightJoin("productVariant as pv", "pv.id", "si.productVariant")
				.rightJoin("product as p", "p.id", "pv.productId")
				.groupBy("p.id")
				.select((eb) => [
					"p.id",
					"p.title",
					"p.thumbnail",
					"p.category",
					sql`ROW_NUMBER() OVER (PARTITION BY p.category ORDER BY p.id)`.as(
						"rn",
					),
					eb.fn
						.jsonAgg(
							jsonBuildObject({
								id: eb.ref("pv.id"),
								inventoryId: eb.ref("si.id"),
								price: eb.fn.coalesce(eb.ref("si.price")),
								maxPrice: eb.ref("pv.price"),
								unit: eb.ref("pv.unit"),
								productId: eb.ref("pv.productId"),
								inStock: eb
									.case()
									.when("si.stock", "=", 0)
									.then(false)
									.when("si.stock", "=", -1)
									.then(true)
									.when("si.stock", ">", 0)
									.then(true)
									.else(false)
									.end(),
							}),
						)
						.as("variants"),
				])
				.as("limited_products");

			const result = await db
				.selectFrom(r)
				.innerJoin("category", "category.id", "limited_products.category")
				.where("limited_products.rn", "<=", 6)
				.select((eb) => [
					"category.id",
					"category.title",
					"category.image",
					"category.slug",
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
