import { type Database, db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
	type Expression,
	type SelectQueryBuilder,
	type SqlBool,
	sql,
} from "kysely";
import { z } from "zod";

const listZodSchema = z.object({
	type: z.enum(["categories", "stores", "products"]),
	q: z.string().optional(),
});

const listZodValidator = zValidator("query", listZodSchema);

const route = new Hono<ServerContext>().get(
	"/",
	listZodValidator,
	async (c) => {
		const { type, q } = c.req.valid("query");

		const exec = () => {
			switch (type) {
				case "categories":
					return db
						.selectFrom("category")
						.$if(!!q, (e) =>
							e.where((eb) => {
								const ors: Expression<SqlBool>[] = [];
								if (q) {
									ors.push(eb("title", "ilike", `%${q}%`));
								}
								return eb.or(ors);
							}),
						)
						.select(["id as value", "title as label", "image as icon"]);

				case "stores":
					return db
						.selectFrom("store")
						.$if(!!q, (e) =>
							e.where((eb) => {
								const ors: Expression<SqlBool>[] = [];
								if (q) {
									ors.push(eb("name", "ilike", `%${q}%`));
								}
								return eb.or(ors);
							}),
						)
						.select(["id as value", "name as label", "image as icon"]);

				case "products":
					return db
						.selectFrom("product")
						.select(["id as value", "title as label", "thumbnail as icon"])

						.$if(!!q, (e) =>
							e.where((eb) => {
								const ors: Expression<SqlBool>[] = [];
								if (q) {
									const v = z.string().uuid().safeParse(q);
									v.success && ors.push(eb("id", "=", v.data));
									ors.push(eb("title", "ilike", `%${q}%`));
								}
								return eb.or(ors);
							}),
						);

				default:
					return null;
			}
		};

		const data = (await exec()?.limit(30).execute()) || [];
		return c.json(data);
	},
);

export { route as merchantComboboxRoute };
