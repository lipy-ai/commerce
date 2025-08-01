import { db } from "@/db";
import { HTTPError } from "@/lib/exception";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { sql } from "kysely";
import z from "zod";
import { productSchema as pSchema } from "./products";

const productSchema = z.object({
	title: z.string(),
	category: z.string().uuid(),
	summary: z.string().nullish(),
	images: z.preprocess(
		(e) => (Array.isArray(e) ? e.filter((e) => !!e) : e),
		z.array(z.string()),
	) as z.ZodType<string[]>,
	highlights: z.array(z.object({ value: z.string(), name: z.string() })),
	information: z.array(z.object({ value: z.string(), name: z.string() })),
	variants: z.array(
		z
			.object({
				id: z.string().uuid(),
				unit: z.string(),
				price: z.coerce.number().min(0),
				maxPrice: z.coerce.number().min(0).optional(),
				images: z.array(z.string()).optional(),
			})
			.refine(
				(data) =>
					!data.maxPrice || data.maxPrice === 0
						? true
						: data.price <= (data.maxPrice || 0),
				{
					message: "Price should not be greater than Max Price",
					path: ["price"],
				},
			),
	),
});

export const adminReviewProductRoute = new Hono<ServerContext>()
	.get(
		"/",
		zValidator(
			"query",
			z.object({
				...listZodSchema.shape,
				cat: z.string().optional(),
				subCat: z.string().optional(),
			}),
		),
		async (c) => {
			const { limit, page, q, cat, subCat } = c.req.valid("query");
			const offset = limit * (page - 1);
			const query = db
				.selectFrom("reviewProducts as p")
				.$if(!!q, (qb) =>
					qb.where(
						sql<boolean>`p."searchVector" @@ plainto_tsquery('english', ${q})`,
					),
				);

			const countCatQ = query
				.select([
					"primaryCategory as name",
					sql<number>`count(id)`.as("total_count"),
				])
				.groupBy(["primaryCategory"])
				.execute();

			const countSubCatQ = query
				.select([
					"subCategory as name",
					sql<number>`count(id)`.as("total_count"),
				])
				.groupBy(["subCategory"])
				.execute();

			const countPromise = query
				.$if(!!cat, (qb) => qb.where("p.category", "=", cat!))
				.$if(!!subCat, (qb) => qb.where("p.subCategory", "=", subCat!))
				.select(sql<number>`count(id)`.as("total_count"))
				.executeTakeFirst();

			const resultsPromise = query
				.$if(!!cat, (qb) => qb.where("p.category", "=", cat!))
				.$if(!!subCat, (qb) => qb.where("p.subCategory", "=", subCat!))
				.leftJoin("category as c", "c.id", "p.category")
				.selectAll(["p"])
				.select((eb) => [eb.fn.toJson("c").as("category")])
				.orderBy("title")
				.limit(limit)
				.offset(offset)
				.execute();

			const [categories, subcategories, countResult, items] = await Promise.all(
				[countCatQ, countSubCatQ, countPromise, resultsPromise],
			);

			const totalCount = countResult?.total_count ?? 0;

			const totalPages = Math.ceil(totalCount / limit);

			return c.json({
				items,
				page,
				limit,
				totalPages,
				totalResults: totalCount,
				categories,
				subcategories,
			});
		},
	)
	.post("/", zValidator("json", productSchema), async (c) => {
		const v = c.req.valid("json");

		const result = await db
			.insertInto("reviewProducts")
			.values(v)
			.returningAll()
			.execute();

		return c.json(result);
	})
	.post(
		"/:id/publish",
		zValidator(
			"param",
			z.object({
				id: z.coerce.number(),
			}),
		),
		async (c) => {
			const { id } = c.req.valid("param");

			const user = c.get("user");

			const p = await db
				.selectFrom("reviewProducts")
				.where("id", "=", id)
				.selectAll()
				.executeTakeFirst();

			if (!p) {
				throw new HTTPError(404, { message: "Review-Product not found!" });
			}

			if (p.reviewedAt) {
				throw new HTTPError(404, { message: "Product published!" });
			}

			const { variants, ...rest } = await pSchema.parseAsync(p);

			const result = await db.transaction().execute(async (trx) => {
				const { id: pid } = await trx
					.insertInto("product")
					.values({
						...rest,
						thumbnail: rest.images[0],
						id: crypto.randomUUID(),
					})
					.returning("id")
					.executeTakeFirstOrThrow();
				await trx
					.insertInto("productVariant")
					.values(variants.map((v) => ({ ...v, productId: pid })))
					.execute();
				const reviewedAt = new Date();
				const reviewedBy = user?.id!;
				await trx
					.updateTable("reviewProducts")
					.where("id", "=", id)
					.set({
						reviewedAt,
						reviewedBy,
						productId: pid,
					})
					.execute();
				return { productId: pid, reviewedAt, reviewedBy };
			});
			return c.json(result);
		},
	)
	.patch(
		"/:id",
		zValidator(
			"param",
			z.object({
				id: z.coerce.number(),
			}),
		),
		zValidator("json", productSchema.partial()),
		async (c) => {
			const { id } = c.req.valid("param");
			const v = c.req.valid("json");

			await db
				.updateTable("reviewProducts")
				.set(v)
				.where("id", "=", id)
				.execute();

			return c.json({ success: true });
		},
	)
	.delete(
		"/",
		zValidator(
			"json",
			z.object({
				ids: z.array(z.coerce.number()),
			}),
		),
		async (c) => {
			const { ids } = c.req.valid("json");
			await db.deleteFrom("reviewProducts").where("id", "in", ids).execute();
			return c.json({ success: true });
		},
	);
