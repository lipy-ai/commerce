import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const route = new Hono<ServerContext>().get(
	"/:id",
	zValidator("param", z.object({ id: z.string().uuid() })),
	async (c) => {
		const { id } = c.req.valid("param");

		console.log("shopId", id);
		const product = await db
			.selectFrom("category")
			.selectAll()
			.where("organization_id", "=", id)
			.execute();

		return c.json(product);
	},
);

export { route as productRoute };
