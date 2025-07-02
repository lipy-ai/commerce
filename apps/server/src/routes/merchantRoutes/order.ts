import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { type Expression, type SqlBool, sql } from "kysely";
import { z } from "zod";

const route = new Hono<ServerContext>()
	.get("/", zValidator("query", listZodSchema), async (c) => {
		const { limit, page, q } = c.req.valid("query");
		const activeStoreId = c.var.session?.activeStoreId!;
		// const activeStoreId = "be2973d8-1df7-442f-9893-3a153f7988ff";
		const offset = limit * (page - 1);
		const query = db
			.selectFrom("orders")
			.where("storeId", "=", activeStoreId)
			.$if(!!q, (e) =>
				e.where((eb) => {
					const ors: Expression<SqlBool>[] = [];
					ors.push(eb("id", "ilike", `%${q}%`));
					return eb.or(ors);
				}),
			);
		const countPromise = query
			.select(sql<number>`count(*)`.as("total_count"))
			.executeTakeFirst();

		const resultsPromise = query
			.selectAll()
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
				.selectFrom("orders as o")
				.where("o.id", "=", id)
				.where("o.storeId", "=", activeStoreId)
				.selectAll(["o"])
				// .select((eb) => [eb.fn.toJson("c").as("category")])
				.executeTakeFirstOrThrow();
			return c.json(result);
		},
	);
export { route as merchantOrderRoute };
