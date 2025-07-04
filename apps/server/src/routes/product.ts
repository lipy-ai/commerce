import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { sql } from "kysely";
import { jsonArrayFrom, jsonBuildObject } from "kysely/helpers/postgres";
import { z } from "zod";

const schema = z.object({
	categorySlug: z.string().optional(),
	storeHandle: z.string().optional(),
	search: z.string().optional(),
});

const route = new Hono<ServerContext>()
	.get("/", zValidator("query", schema), async (c) => {
		const q = c.req.valid("query");
		let query = db
			.selectFrom("storeInventory as si")
			.leftJoin("store as s", "s.id", "si.storeId")
			.rightJoin("productVariant as pv", "pv.id", "si.productVariant")
			.rightJoin("product as p", "p.id", "pv.productId")
			.rightJoin("category as c", "p.category", "c.id")
			.groupBy(["p.id", "c.title", "c.id", "c.slug"]) // <-- fix here
			.orderBy("c.id");

		if (q.categorySlug) {
			query = query.where("c.slug", "=", q.categorySlug);
		}

		if (q.storeHandle) {
			query = query.where("s.handle", "=", q.storeHandle);
		}

		if (q.search) {
			query = query.where("p.title", "like", `%${q.search}%`);
		}

		const data = await query
			.select((eb) => [
				"p.id as id",
				"p.title",
				"p.thumbnail",
				"c.title as categoryTitle",
				"c.id as category",
				"c.slug as categorySlug",
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
			.execute();

		return c.json(data || []);
	})
	.get(
		"/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			const q = c.req.valid("param");

			const data = await db
				.selectFrom("storeInventory as si")
				.rightJoin("productVariant as pv", "pv.id", "si.productVariant")
				.rightJoin("product as p", "p.id", "pv.productId")
				.groupBy(["p.id", "si.storeId"])
				.where("p.id", "=", q.id)
				.select((eb) => [
					"p.id as id",
					"p.title as title",
					"p.thumbnail as thumbnail",
					"si.storeId as storeId",
					"p.category as category",
					"p.images",
					"p.highlights",
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
				.executeTakeFirstOrThrow();

			return c.json(data);
		},
	);

export { route as productRoute };
