import { type DBTypes, db } from "@/db";
import { PRODUCT_TYPE } from "@/db/schema";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { type Insertable, sql } from "kysely";
import { P } from "pino";
import { z } from "zod";

const listZodSchema = z.object({
	limit: z.coerce.number().max(50),
	page: z.coerce.number().min(1),
	q: z.string().optional(),
});

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

const listZodValidator = zValidator("query", listZodSchema);

const route = new Hono<ServerContext>()
	.get("/", listZodValidator, async (c) => {
		const { limit, page, q } = c.req.valid("query");
		const activeStoreId = c.var.session?.activeStoreId!;
		// const activeStoreId = "be2973d8-1df7-442f-9893-3a153f7988ff";
		const offset = limit * (page - 1);

		const countPromise = db
			.selectFrom("product")
			.where("storeId", "=", activeStoreId)
			.$if(!!q, (e) => e.where("title", "ilike", `%${q}%`))
			.select(sql<number>`count(*)`.as("total_count"))
			.executeTakeFirst();

		const resultsPromise = db
			.selectFrom("product")
			.selectAll()
			.where("storeId", "=", activeStoreId)
			.$if(!!q, (e) => e.where("title", "ilike", `%${q}%`))
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

			// const activeStoreId = "be2973d8-1df7-442f-9893-3a153f7988ff";

			const result = await db
				.selectFrom("product as p")
				.where("p.id", "=", id)
				.where("p.storeId", "=", activeStoreId)
				.leftJoin("category as c", "c.id", "p.category")
				.selectAll(["p"])
				.select((eb) => [eb.fn.toJson("c").as("category")])
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

			const activeStoreId = c.var.session?.activeStoreId!;
			const result = await db
				.updateTable("product")
				.where("id", "=", id)
				.where("storeId", "=", activeStoreId)
				.set(values)
				.executeTakeFirstOrThrow();
			return c.json(values);
		},
	)
	.delete(
		"/",
		zValidator(
			"json",
			z.object({
				ids: z.array(z.string()),
			}),
		),
		async (c) => {
			const { ids } = c.req.valid("json");
			const activeStoreId = c.var.session?.activeStoreId!;
			const result = await db
				.deleteFrom("product")
				.where("id", "in", ids)
				.where("storeId", "=", activeStoreId)
				.executeTakeFirstOrThrow();
			return c.json(result);
		},
	);

export { route as merchantProductRoute };
