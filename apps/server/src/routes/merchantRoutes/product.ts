import { Hono } from "hono";
import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { z } from "zod";
import { getGroqChatStream, googleVisionClient } from "@/ai";
import { db } from "@/db";
import { diffById } from "@/lib/compare";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";

const productSchema = z.object({
	title: z.string(),
	category: z.string(),

	summary: z.string(),
	images: z.preprocess(
		(e) => (Array.isArray(e) ? e.filter((e) => !!e) : e),
		z.array(z.string()),
	),

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
		showAll: z.coerce.boolean().optional(),
		globalOnly: z.coerce.boolean().optional(),
	}),
);

const route = new Hono<ServerContext>()
	.get("/", listZodValidator, async (c) => {
		const { limit, page, q, category, showAll, globalOnly } =
			c.req.valid("query");
		const activeStoreId = c.var.session?.activeStoreId!;
		const offset = limit * (page - 1);

		const query = db
			.selectFrom("product as p")
			// .where((eb) =>
			// 	eb.or([eb("p.store", "=", activeStoreId!), eb("p.store", "is", null)]),
			// )
			.$if(!!globalOnly, (qb) => qb.where("p.store", "is", null))
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
					.onRef("si.variantId", "=", "pv.id")
					.on("si.storeId", "=", activeStoreId!),
			)
			.$if(!!category, (qb) => qb.where("category", "=", category!))
			.$if(!showAll, (qb) =>
				qb.where((eb) =>
					eb.or([
						eb("p.store", "=", activeStoreId!),
						eb("si.storeId", "=", activeStoreId!),
					]),
				),
			);

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
				"p.summary",
				"p.store",
				"p.status",
				jsonBuildObject({
					id: eb.ref("c.id"),
					title: eb.ref("c.title"),
				}).as("category"),
				eb.fn
					.jsonAgg(
						jsonBuildObject({
							id: eb.ref("pv.id"),
							inventoryId: eb.ref("si.id"),
							images: eb.ref("pv.images"),
							price: eb.ref("pv.price"),
							unit: eb.ref("pv.unit"),
							maxPrice: eb.ref("pv.maxPrice"),
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
			.groupBy(["p.id", "c.id"])

			.orderBy("p.store")
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
						.onRef("si.variantId", "=", "pv.id")
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
	.post("/", zValidator("json", productSchema), async (c) => {
		const { variants, ...vals } = c.req.valid("json");
		const sess = c.get("session");

		const result = await db.transaction().execute(async (trx) => {
			const p = await trx
				.insertInto("product")
				.values({
					id: crypto.randomUUID(),
					...vals,
					status: "underReview",
					thumbnail: vals.images[0] || "",
					store: sess?.activeStoreId!,
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
		zValidator("param", z.object({ id: z.string().uuid() })),
		zValidator("json", productSchema.partial()),
		async (c) => {
			const { id } = c.req.valid("param");
			const { variants, ...vals } = c.req.valid("json");

			await db.transaction().execute(async (trx) => {
				const p = await trx
					.updateTable("product")
					.where("id", "=", id)
					.set({
						...vals,
						thumbnail: vals ? (vals.images ? vals.images[0] : "") : "",
						status: "underReview",
					})
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
	)
	.post(
		"/bulk",
		zValidator("json", z.object({ file: z.string() })),
		async (c) => {
			const { file } = c.req.valid("json");

			console.log(file);

			const buffer = Buffer.from(file, "base64");

			const [result] = await googleVisionClient.textDetection(buffer);
			const rawText = result.textAnnotations?.[0]?.description || "";
			console.log(rawText);

			const groqResponse = await getGroqChatStream({
				messages: [
					{
						role: "system",
						content:
							"You are a menu parser. Convert OCR menu text into structured JSON.",
					},
					{
						role: "user",
						content: `Here is the OCR text:\n${rawText}\n\nConvert it into an array of JSON objects with the following structure:
[
  {
    "title": "Name of the item",
    "category": "Category of the item",
    "summary": "Short description of the item",
    "variants": [
      {
        "id": "unique uuid string (generate a unique one)",
        "unit": "Give the variant a name  (use 'serves 1' if not specified).",
        "price": number,
        "maxPrice": number
      }
    ]
  }
]

- Always include at least one variant per item.
- Generate unique UUIDs for each variant.
- Only return the JSON array; do not include any explanations or extra text.`,
					},
				],
			});

			const content = groqResponse.choices[0].message.content;

			if (!content) {
				return c.json({ error: "Something went wrong" }, 400);
			}

			console.log(content);

			return c.json(content);
		},
	);

export { route as merchantProductRoute };
