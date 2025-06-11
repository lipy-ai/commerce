import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const updateSchema = z.object({
	name: z.string(),
	handle: z.string(),
	description: z.string(),
	email: z.string(),
	phone: z.string(),
});

const route = new Hono<ServerContext>().patch(
	"/",
	zValidator("json", updateSchema),
	async (c) => {
		const session = c.get("session");
		const values = c.req.valid("json");

		await db
			.updateTable("store")
			.where("store.id", "=", session?.activeStoreId!)
			.set({
				...values,
			})
			.execute();

		return c.json({ success: true });
	},
);

export { route as merchantStoreRoute };
