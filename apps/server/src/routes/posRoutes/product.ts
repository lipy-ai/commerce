import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { z } from "zod";

const schema = z.object({
	items: z
		.array(
			z.object({
				inventoryId: z.string().uuid().optional(),
				variantId: z.string().optional(),
				productId: z.string().uuid().optional(),
				title: z.string(),
				thumbnail: z.string(),
				unit: z.string(),
				qty: z.number().min(1),
				price: z.number().min(0),
				maxPrice: z.number().min(0),
			}),
		)
		.min(1),
	taxes: z.array(
		z.object({ id: z.string(), title: z.string(), amount: z.number() }),
	),
	discounts: z.array(
		z.object({ id: z.string(), title: z.string(), amount: z.number() }),
	),
});

export function orderCalculator({
	items,
	discounts,
	taxes,
}: {
	items: Array<{ price: number; maxPrice?: number; qty: number }>;
	discounts: Array<{ amount: number }>;
	taxes: Array<{ amount: number }>;
}) {
	const itemsTotal = items.reduce(
		(sum, item) => sum + item.price * item.qty,
		0,
	);
	const maxItemsTotal = items.reduce(
		(sum, item) => sum + (item.maxPrice ?? item.price) * item.qty,
		0,
	);

	const discountTotal = discounts.reduce((sum, d) => sum + d.amount, 0);
	const taxTotal = taxes.reduce((sum, t) => sum + t.amount, 0);

	const totalAmount = itemsTotal + taxTotal - discountTotal;
	const maxTotalAmount = maxItemsTotal + taxTotal - discountTotal;

	return {
		itemsTotal,
		maxItemsTotal,
		discountTotal,
		taxTotal,
		totalAmount,
		totalSaved: maxTotalAmount - totalAmount,
	};
}

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

export const posProductRoute = new Hono<ServerContext>()
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
	.post("/", zValidator("json", schema), async (c) => {
		const { items, taxes, discounts } = c.req.valid("json");

		const calcs = orderCalculator({
			items,
			taxes,
			discounts,
		});

		return c.json({ calcs });
	});
