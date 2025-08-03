import { Hono } from "hono";
import { sql } from "kysely";
import z from "zod";
import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";

export const merchantCustomerRoute = new Hono<ServerContext>()
	.get("/", zValidator("query", listZodSchema), async (c) => {
		const { limit, page, q } = c.req.valid("query");
		const activeStoreId = c.var.session?.activeStoreId!;
		const offset = limit * (page - 1);
		const query = db
			.selectFrom("customer as c")
			.where("c.storeId", "=", activeStoreId)
			.leftJoin("user as u", "u.id", "c.userId")

			.$if(!!q, (e) =>
				e.where((eb) => {
					const words = q!.trim().split(/\s+/);

					const wordMatches = words.map((word) =>
						eb("u.name", "ilike", `%${word}%`),
					);
					return eb.or([
						eb.and(wordMatches), // All words should be in u.name
						eb("u.name", "ilike", `%${q}%`),
						eb("u.email", "ilike", `%${q}%`),
						eb("u.phoneNumber", "ilike", `%${q}%`),
					]);
				}),
			);

		const countPromise = query
			.select(sql<number>`count(*)`.as("total_count"))
			.executeTakeFirst();

		const resultsPromise = query
			.select(["u.id", "u.email", "u.phoneNumber", "u.name", "u.image"])
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
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			const id = c.req.param("id");
			const customer = await db
				.selectFrom("user as u")
				.leftJoin("userAddress as ua", "ua.id", "u.address")
				.leftJoin("address", "address.id", "ua.id")
				.select([
					"u.id",
					"u.email",
					"u.phoneNumber",
					"u.name",
					"u.image",
					"address.line1 as address",
				])
				.where("u.id", "=", id)
				.executeTakeFirstOrThrow();
			return c.json(customer);
		},
	);
