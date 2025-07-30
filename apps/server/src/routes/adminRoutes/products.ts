import { db } from "@/db";
import { diffById } from "@/lib/compare";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { z } from "zod";

export const productSchema = z.object({
	title: z.string(),
	category: z.string(),
	summary: z.string(),
	images: z.preprocess(
		(e) => (Array.isArray(e) ? e.filter((e) => !!e) : e),
		z.array(z.string()),
	) as z.ZodType<string[]>,
	highlights: z.array(z.object({ value: z.string(), name: z.string() })),
	information: z.array(z.object({ value: z.string(), name: z.string() })),
	variants: z.array(
		z.object({
			id: z.string().uuid(),
			unit: z.string(),
			price: z.coerce.number().min(0),
			maxPrice: z.coerce.number().min(0).catch(0),
			images: z.array(z.string()).nullish(),
		}),
	),
});

const listZodValidator = zValidator(
	"query",
	z.object({
		...listZodSchema.shape,
		category: z.preprocess(
			(t) => (!t ? undefined : t),
			z.string().uuid().optional(),
		),
	}),
);

export const adminProductRoute = new Hono<ServerContext>()
	.get("/", listZodValidator, async (c) => {
		const { limit, page, q, category } = c.req.valid("query");
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
			.$if(!!category, (qb) => qb.where("category", "=", category!));

		const countPromise = query
			.select(sql<number>`count(*)`.as("total_count"))
			.executeTakeFirst();

		const resultsPromise = query

			.selectAll(["p"])
			.select((eb) => [
				eb.fn.toJson("c").as("category"),
				eb.fn
					.jsonAgg(
						jsonBuildObject({
							id: eb.ref("pv.id"),
							images: eb.ref("pv.images"),
							price: eb.ref("pv.price"),
							maxPrice: eb.ref("pv.maxPrice"),

							unit: eb.ref("pv.unit"),
							productId: eb.ref("pv.productId"),
						}),
					)
					.filterWhere("pv.id", "is not", null)
					.as("variants"),
			])
			.groupBy(["p.id", "c.id"])
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
								maxPrice: eb.ref("pv.maxPrice"),
								unit: eb.ref("pv.unit"),
								productId: eb.ref("pv.productId"),
								stock: eb.ref("si.stock"),
								sku: eb.ref("si.sku"),
								storePrice: eb.ref("si.price"),
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
	.post("/", zValidator("json", productSchema), async (c) => {
		const { variants, ...vals } = c.req.valid("json");

		const result = await db.transaction().execute(async (trx) => {
			const p = await trx
				.insertInto("product")
				.values({
					...vals,
					id: crypto.randomUUID(),
					status: "draft",
					type: "food",
					thumbnail: "",
					keywords: null,
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			const v = variants.map((m) => ({
				...m,
				id: crypto.randomUUID(),
				productId: p.id,
			}));

			if (v.length > 0) {
				await trx.insertInto("productVariant").values(v).execute();
			}

			return { ...p, variants: v };
		});

		return c.json(result);
	})
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
			const { variants, ...vals } = c.req.valid("json");

			const result = await db.transaction().execute(async (trx) => {
				const p = await trx
					.updateTable("product")
					.where("id", "=", id)
					.set(vals)
					.executeTakeFirstOrThrow();

				if (!variants || variants?.length === 0) return p;

				const oldVars = await trx
					.selectFrom("productVariant")
					.where("productId", "=", id)
					.select(["id", "images", "price", "unit", "maxPrice"])
					.execute();

				const diff = diffById(
					oldVars,
					variants.map((v) => ({ ...v, images: v.images || null })),
				);

				await Promise.all([
					diff.added.length > 0
						? trx
								.insertInto("productVariant")
								.values(
									diff.added.map((v) => ({
										...v,
										productId: id,
									})),
								)
								.execute()
						: Promise.resolve(),

					diff.deleted.length > 0
						? trx
								.deleteFrom("productVariant")
								.where(
									"id",
									"in",
									diff.deleted.map((m) => m.id),
								)
								.execute()
						: Promise.resolve(),

					...diff.updated.map((u) => {
						return trx
							.updateTable("productVariant")
							.where("id", "=", u.updated.id)
							.set(u.updated)
							.execute();
					}),
				]);

				return p;
			});

			return c.json({ success: true });
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
