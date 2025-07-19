import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { sql } from "kysely";
import { z } from "zod";

const listZodValidator = zValidator(
	"query",
	z.object({
		...listZodSchema.shape,
	}),
);
export const adminCategoryRoute = new Hono<ServerContext>()
	.get("/", listZodValidator, async (c) => {
		const { limit, page, q } = c.req.valid("query");
		const offset = limit * (page - 1);

		const query = db.selectFrom("category as c").$if(!!q, (qb) => {
			const words = q!.trim().split(/\s+/);
			return words.reduce(
				(acc, word) => acc.where("c.title", "ilike", `%${word}%`),
				qb,
			);
		});

		const countPromise = query
			.select(sql<number>`count(*)`.as("total_count"))
			.executeTakeFirst();

		const resultsPromise = query
			.selectAll()
			.orderBy("c.title asc")
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
	.post(
		"/",
		zValidator(
			"json",
			z.object({
				title: z.string().optional(),
				summary: z.string().optional(),
				image: z.string().nullish(),
			}),
		),
		async (c) => {
			const vals = c.req.valid("json");
			const id = crypto.randomUUID();
			const result = await db
				.insertInto("category")
				.values({ ...vals, id })
				.returningAll()
				.executeTakeFirstOrThrow();

			return c.json(result);
		},
	)
	.patch(
		"/",
		zValidator(
			"json",
			z.object({
				id: z.string(),
				title: z.string().optional(),
				summary: z.string().optional(),
				image: z.string().nullish(),
			}),
		),
		async (c) => {
			const { id, ...rest } = c.req.valid("json");
			await db
				.updateTable("category")
				.where("id", "=", id)
				.set(rest)
				.executeTakeFirstOrThrow();

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

			await db
				.deleteFrom("category")
				.where("id", "in", ids)
				.executeTakeFirstOrThrow();
			return c.json({ success: true });
		},
	);
