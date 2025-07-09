import { db } from "@/db";
import { ORDER_STATUS } from "@/db/schema";
import { HTTPError } from "@/lib/exception";
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
	)
	.patch(
		"/:id",
		zValidator(
			"param",
			z.object({
				id: z.string(),
			}),
		),
		zValidator(
			"json",
			z.object({
				status: z.enum(ORDER_STATUS),
			}),
		),
		async (c) => {
			const { id } = c.req.valid("param");
			const { status } = c.req.valid("json");

			const order = await db
				.selectFrom("orders")
				.where("id", "=", id)
				.executeTakeFirst();

			if (!order) {
				throw new HTTPError(404, {
					message: "No order found!",
				});
			}

			const statusIdx = ORDER_STATUS.indexOf(status);

			const oldStatusIdx = ORDER_STATUS.indexOf(status);

			if (oldStatusIdx > statusIdx) {
				throw new HTTPError(401, {
					message: `Can't change to this order to "${status}" status, because the order has been already tagged with "${status}" before.`,
				});
			}

			await db
				.updateTable("orders")
				.where("id", "=", id)
				.set({
					status,
				})
				.execute();

			return c.json({ success: true });
		},
	);
export { route as merchantOrderRoute };
