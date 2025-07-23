import { type DBTypes, db } from "@/db";
import { PRODUCT_TYPE } from "@/db/schema";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { type Insertable, sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { z } from "zod";
import { sseEmitter } from "./events";

const productSchema = z.object({
	title: z.string(),
	category: z.string(),
	price: z.coerce.number().min(1),
	maxPrice: z.coerce.number().min(1),
	type: z.enum(PRODUCT_TYPE),
	summary: z.string(),
	thumbnail: z.string(),
	images: z.preprocess(
		(e) => (Array.isArray(e) ? e.filter((e) => !!e) : e),
		z.array(z.string()),
	),

	highlights: z.array(z.object({ value: z.string(), label: z.string() })),
	information: z.array(z.object({ value: z.string(), label: z.string() })),
});

const listZodValidator = zValidator(
	"query",
	z.object({
		...listZodSchema.shape,
		category: z.preprocess(
			(t) => (!t ? undefined : t),
			z.string().uuid().optional(),
		),
		showAll: z.coerce.boolean().optional(),
	}),
);

const route = new Hono<ServerContext>()
	.get("/", listZodValidator, async (c) => {
		const { limit, page, q, category, showAll } = c.req.valid("query");
		const activeStoreId = c.var.session?.activeStoreId!;
		const offset = limit * (page - 1);

		const query = db
			.selectFrom("product as p")
			.$if(!!q, (qb) => {
				const words = q!.trim().split(/\s+/);
				return words.reduce(
					(acc, word) => acc.where("p.title", "ilike", `%${word}%`),
					qb,
				);
			})
			.leftJoin("productVariant as pv", "pv.productId", "p.id")
			.leftJoin("category as c", "p.category", "c.id")

			.leftJoin("storeInventory as si", (join) =>
				join
					.onRef("si.productVariant", "=", "pv.id")
					.on("si.storeId", "=", activeStoreId!),
			)
			.$if(!!category, (qb) => qb.where("category", "=", category!))
			.$if(!showAll, (qb) => qb.where("si.storeId", "=", activeStoreId!));

		const countPromise = query
			.select(sql<number>`count(*)`.as("total_count"))
			.executeTakeFirst();

		const resultsPromise = query

			.select((eb) => [
				"p.id",
				"p.title",
				"p.thumbnail",
				"p.price",
				"p.maxPrice",
				"c.title as category",
				"p.summary",
				eb.fn
					.jsonAgg(
						jsonBuildObject({
							id: eb.ref("pv.id"),
							inventoryId: eb.ref("si.id"),

							images: eb.ref("pv.images"),
							price: eb.ref("pv.price"),
							unit: eb.ref("pv.unit"),
							productId: eb.ref("pv.productId"),
							stock: eb.fn.coalesce(eb.ref("si.stock")),
							sku: eb.fn.coalesce(eb.ref("si.sku")),
							storePrice: eb.fn.coalesce(eb.ref("si.price")),
							active: eb.fn.coalesce(eb.ref("si.active")),
						}),
					)
					.filterWhere("pv.id", "is not", null)
					.as("variants"),
			])
			.groupBy(["p.id", "c.title"])
			.limit(limit)
			.offset(offset)
			.execute();

		const [countResult, items] = await Promise.all([
			countPromise,
			resultsPromise,
		]);

		const totalCount = countResult?.total_count ?? 0;

		const totalPages = Math.ceil(totalCount / limit);

		return c.json({ items, page, limit, totalPages, totalResults: totalCount });
	})
	.get(
		"/:id",
		zValidator(
			"param",
			z.object({
				id: z.string(),
			}),
		),
		async (c) => {
			const { id } = c.req.valid("param");
			const activeStoreId = c.var.session?.activeStoreId!;

			const result = await db
				.selectFrom("product as p")
				.where("p.id", "=", id)
				.leftJoin("category as c", "c.id", "p.category")
				.leftJoin("productVariant as pv", "pv.productId", "p.id")
				.leftJoin("storeInventory as si", (join) =>
					join
						.onRef("si.productVariant", "=", "pv.id")
						.on("si.storeId", "=", activeStoreId!),
				)
				.selectAll(["p"])
				.select((eb) => [
					eb.fn.toJson("c").as("category"),
					eb.fn
						.jsonAgg(
							jsonBuildObject({
								id: eb.ref("pv.id"),
								images: eb.ref("pv.images"),
								price: eb.ref("pv.price"),
								unit: eb.ref("pv.unit"),
								productId: eb.ref("pv.productId"),
								stock: eb.ref("si.stock"),
								sku: eb.ref("si.sku"),
								storePrice: eb.ref("si.price"),
								active: eb.fn.coalesce(eb.ref("si.active")),
							}),
						)
						.filterWhere("pv.id", "is not", null)
						.as("variants"),
				])
				.groupBy(["p.id", "c.id"])
				.executeTakeFirstOrThrow();
			return c.json(result);
		},
	)
	.post(
		"/",
		zValidator(
			"json",
			z.object({
				products: z.array(productSchema),
			}),
		),
		async (c) => {
			const { products } = c.req.valid("json");
			const activeStoreId = c.var.session?.activeStoreId!;

			const newProducts = products.map((p) => ({
				...p,
				id: crypto.randomUUID(),
				storeId: activeStoreId,
			})) satisfies Insertable<DBTypes["product"]>[];

			const result = await db
				.insertInto("product")
				.values(newProducts)
				.executeTakeFirstOrThrow();
			return c.json(result);
		},
	)
	.patch(
		"/:id",
		zValidator(
			"param",
			z.object({
				id: z.string().uuid(),
			}),
		),
		zValidator("json", productSchema.partial()),
		async (c) => {
			const { id } = c.req.valid("param");
			const { images, ...values } = c.req.valid("json");
			console.log("emitted msg");
			sseEmitter.emit("send-to-user", {
				userId: c.var.session?.userId,
				event: "notify",
				data: "message",
			});

			// const activeStoreId = c.var.session?.activeStoreId!;
			// await db
			// 	.updateTable("product")
			// 	.where("id", "=", id)
			// 	.where("storeId", "=", activeStoreId)
			// 	.set(values)
			// 	.executeTakeFirstOrThrow();

			return c.json(values);
		},
	)
	.delete(
		"/",
		zValidator(
			"json",
			z.object({
				ids: z.array(z.string().uuid()),
			}),
		),
		async (c) => {
			const { ids } = c.req.valid("json");

			await db.deleteFrom("product").where("id", "in", ids).execute();
			return c.json({ success: true });
		},
	);

export { route as merchantProductRoute };
