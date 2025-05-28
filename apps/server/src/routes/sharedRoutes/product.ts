import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { z } from "zod";

const schema = z.object({
	category_id: z.string().optional(),
	shop_id: z.string().optional(),
	search: z.string().optional(),
});

const route = new Hono<ServerContext>()
	.get("/", zValidator("query", schema), async (c) => {
		const q = c.req.valid("query");

		const query = db.selectFrom("product as p");

		if (q.category_id) {
			query.where("p.category", "=", q.category_id);
		}

		if (q.shop_id) {
			query.where("p.organization_id", "=", q.shop_id);
		}

		if (q.search) {
			query.where("p.title", "=", q.search);
		}

		const data = await query
			.select((eb) => [
				"p.id",
				"p.brand",
				"p.category",
				"p.in_stock",
				jsonArrayFrom(
					eb
						.selectFrom("product_variant as pv")
						.selectAll()
						.whereRef("pv.product", "=", "p.id"),
				).as("variants"),
			])
			.execute();

		return c.json(data || []);
	})
	.get(
		"/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			const q = c.req.valid("param");

			const data = await db
				.selectFrom("product as p")
				.where("p.id", "=", q.id)
				.select((eb) => [
					"p.id",
					"p.brand",
					"p.category",
					"p.in_stock",
					jsonArrayFrom(
						eb
							.selectFrom("product_variant as pv")
							.selectAll()
							.whereRef("pv.product", "=", "p.id"),
					).as("variants"),
				])
				.executeTakeFirstOrThrow();

			return c.json(data);
		},
	);

export { route as productRoute };
