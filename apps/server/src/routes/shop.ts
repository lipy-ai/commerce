import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const cartSchema = z.object({
	variantId: z.number(),
	quantity: z.number().min(0).int(),
});

const route = new Hono<ServerContext>()
	/**
	 * Gets All Shops
	 */
	.get("/", async (c) => {
		const d = await db
			.selectFrom("store")
			.where("active", "=", true)
			.selectAll()
			.execute();
		return c.json(d || []);
	})
	.get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
		const { id } = c.req.valid("param");
		const d = await db
			.selectFrom("store")
			.where("id", "=", id)
			.selectAll()
			.executeTakeFirst();

		if (!d) {
			throw new HTTPException(404, { message: "Store not found!" });
		}
		return c.json(d || []);
	});

export { route as shopRoute };
