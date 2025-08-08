import { Hono } from "hono";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { z } from "zod";
import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";

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
			.rightJoin("productVariant as pv", "pv.id", "si.variantId")
			.rightJoin("product as p", "p.id", "pv.productId")
			.rightJoin("category as c", "p.category", "c.id")
			.groupBy(["p.id", "c.title", "c.id", "c.slug"]) // <-- fix here
			.orderBy("c.id")
			.where("si.active", "=", true);

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
		"/singleProduct",
		zValidator(
			"query",
			z.object({ productId: z.string().uuid(), handle: z.string() }),
		),
		async (c) => {
			const q = c.req.valid("query");

			const data = await db
				.selectFrom("storeInventory as si")
				.rightJoin("productVariant as pv", "pv.id", "si.variantId")
				.rightJoin("product as p", "p.id", "pv.productId")
				.rightJoin("store as s", "s.id", "si.storeId")
				.groupBy(["p.id", "si.storeId"])
				.where("s.handle", "=", q.handle)
				.where("p.id", "=", q.productId)
				.where("si.active", "=", true)
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
	)
	.get(
		"/:id/search",
		zValidator("param", z.object({ id: z.string().uuid() })),
		zValidator("query", z.object({ q: z.string().optional() })),
		async (c) => {
			const { q } = c.req.valid("query");
			const { id } = c.req.valid("param");
			const query = db
				.selectFrom("storeInventory as si")
				.where("si.storeId", "=", id)
				.rightJoin("productVariant as pv", "pv.id", "si.variantId")
				.rightJoin("product as p", "p.id", "pv.productId")
				.$if(!!q, (qb) => {
					const words = q!.trim().split(/\s+/);
					return words.reduce(
						(acc, word) => acc.where("p.title", "ilike", `%${word}%`),
						qb,
					);
				});

			const data = await query
				.select(["p.id as id", "p.title", "p.thumbnail"])
				.groupBy(["p.id"])
				.limit(10)
				.execute();
			return c.json(data);
		},
	);

export { route as productRoute };
