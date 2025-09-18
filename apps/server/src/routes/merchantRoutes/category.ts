import { Hono } from "hono";
import z from "zod";
import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";

const route = new Hono<ServerContext>().post(
	"/",
	zValidator(
		"json",
		z.object({
			title: z.string().optional(),
		}),
	),
	async (c) => {
		const vals = c.req.valid("json");
		const sess = c.get("session");
		const id = crypto.randomUUID();
		const result = await db
			.insertInto("category")
			.values({ ...vals, id, store: sess?.activeStoreId! })
			.returningAll()
			.executeTakeFirstOrThrow();

		return c.json(result);
	},
);

export { route as merchantCategoryRoute };
