import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { sql } from "kysely";
import { z } from "zod";

const listZodSchema = z.object({
	limit: z.coerce.number().max(50),
	page: z.coerce
		.number()
		.min(1)
		.transform((t) => t - 1),
});

const listZodValidator = zValidator("query", listZodSchema);

const route = new Hono<ServerContext>()
	.get("/", listZodValidator, async (c) => {
		const { limit, page } = c.req.valid("query");
		const activeStoreId = c.var.session?.activeStoreId!;
		const offset = limit * page;

		const countPromise = db
			.selectFrom("product")
			.where("storeId", "=", activeStoreId)
			.select(sql<number>`count(*)`.as("total_count"))
			.executeTakeFirst();

		const resultsPromise = db
			.selectFrom("product")
			.selectAll()
			.where("storeId", "=", activeStoreId)
			.limit(limit)
			.offset(offset)
			.execute();

		const [countResult, items] = await Promise.all([
			countPromise,
			resultsPromise,
		]);

		const totalCount = countResult?.total_count ?? 0;

		const totalPages = Math.ceil(totalCount / limit);

		return c.json({ items, page, limit, totalPages });
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
				.selectFrom("product")
				.where("id", "=", id)
				.where("storeId", "=", activeStoreId)
				.executeTakeFirstOrThrow();
			return c.json(result);
		},
	)
	.post(
		"/",
		zValidator(
			"json",
			z.object({
				products: z.array(z.object({})),
			}),
		),
		async (c) => {
			const { products } = c.req.valid("json");
			const activeStoreId = c.var.session?.activeStoreId!;

			const result = await db
				.insertInto("product")
				.values([])
				.executeTakeFirstOrThrow();
			return c.json(result);
		},
	)
	.patch(
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
				.updateTable("product")
				.where("id", "=", id)
				.where("storeId", "=", activeStoreId)
				.set({})
				.executeTakeFirstOrThrow();
			return c.json(result);
		},
	)
	.delete(
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
				.deleteFrom("product")
				.where("id", "=", id)
				.where("storeId", "=", activeStoreId)
				.executeTakeFirstOrThrow();
			return c.json(result);
		},
	);

export { route as merchantProductRoute };
