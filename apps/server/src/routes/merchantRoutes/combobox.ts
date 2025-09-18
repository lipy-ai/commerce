import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";

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
		const sess = c.get("session");

		const exec = () => {
			switch (type) {
				case "categories":
					return db
						.selectFrom("category")
						.where("store", "=", sess?.activeStoreId!)
						.$if(!!q, (qb) => {
							const words = q!.trim().split(/\s+/);
							return words.reduce(
								(acc, word) => acc.where("title", "ilike", `%${word}%`),
								qb,
							);
						})
						.select(["id as value", "title as label", "image as icon"]);

				case "stores":
					return db
						.selectFrom("store")
						.$if(!!q, (e) =>
							e.where((eb) => {
								const words = q!.trim().split(/\s+/);

								const wordMatches = words.map((word) =>
									eb("name", "ilike", `%${word}%`),
								);
								return eb.or([
									eb.and(wordMatches), // All words should be in u.name
								]);
							}),
						)
						.select(["id as value", "name as label", "image as icon"]);

				case "products":
					return db
						.selectFrom("product")
						.select(["id as value", "title as label", "thumbnail as icon"])

						.$if(!!q, (e) =>
							e.where((eb) => {
								const words = q!.trim().split(/\s+/);
								const v = z.string().uuid().safeParse(q);

								const wordMatches = words.map((word) =>
									eb("title", "ilike", `%${word}%`),
								);
								return eb.or([
									...(v.success ? [eb("id", "=", v.data)] : []),
									eb.and(wordMatches),
								]);
							}),
						);

				default:
					return null;
			}
		};

		const data =
			(await exec()
				?.$if(type !== "categories", (qb: any) => qb.limit(50))
				?.execute()) || [];
		return c.json(data);
	},
);

export { route as merchantComboboxRoute };
