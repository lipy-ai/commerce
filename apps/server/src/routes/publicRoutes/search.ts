import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";

const searchSchema = z.object({
	q: z.string().optional(),
});

export const publicSearchRoute = new Hono<ServerContext>().get(
	"/",
	zValidator("query", searchSchema),
	async (c) => {
		const { q } = c.req.valid("query");
		const resp = await db
			.selectFrom("store as s")
			.where("s.active", "=", true)
			.$if(!!q, (qb) => qb.where("name", "ilike", `%${q}%`))
			.select([
				"id",
				"handle",
				"type",
				"name",
				"image",
				"address",
				"freeDeliveryDistance",
				"deliveryDistance",
			])
			.limit(25)
			.execute();
		return c.json(resp || []);
	},
);
