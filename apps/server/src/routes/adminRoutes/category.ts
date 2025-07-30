import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";

import { z } from "zod";

const listZodValidator = zValidator(
	"query",
	z.object({
		...listZodSchema.shape,
	}),
);
export const adminCategoryRoute = new Hono<ServerContext>()
	.get("/", listZodValidator, async (c) => {
		const { q } = c.req.valid("query");

		const subPromise = db
			.selectFrom("category as c")
			.selectAll()
			.$if(!!q, (qb) => {
				const words = q!.trim().split(/\s+/);
				return words.reduce(
					(acc, word) => acc.where("c.title", "ilike", `%${word}%`),
					qb,
				);
			})
			.orderBy("c.title asc")
			.execute();

		const primaryPromise = db
			.selectFrom("category as c")
			.where("c.parentId", "is", null)
			.$if(!!q, (qb) => {
				const words = q!.trim().split(/\s+/);
				return words.reduce(
					(acc, word) => acc.where("c.title", "ilike", `%${word}%`),
					qb,
				);
			})
			.selectAll()
			.orderBy("c.title asc")
			.execute();

		const [primaryCats, subCats] = await Promise.all([
			primaryPromise,
			subPromise,
		]);

		const items = primaryCats.map((m) => {
			return {
				...m,
				items: subCats.filter((f) => f.parentId === m.id),
			};
		});

		// if (q) {
		// 	items = items.filter((f) => f.items.length !== 0);
		// }

		return c.json({ items });
	})
	.post(
		"/",
		zValidator(
			"json",
			z.object({
				title: z.string().optional(),
				summary: z.string().optional(),
				image: z.string().nullish(),
				parentId: z.string().uuid().nullish(),
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
				parentId: z.string().uuid().nullish(),
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
