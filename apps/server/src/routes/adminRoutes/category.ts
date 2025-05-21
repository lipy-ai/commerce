import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const route = new Hono<ServerContext>();

route.get("/", (c) => {
	return c.json({ success: "category" });
});

route.get(
	"/:id",
	zValidator(
		"param",
		z.object({
			id: z.string(),
		}),
	),
	async (c) => {
		const { id } = c.req.valid("param");
		const result = await db
			.selectFrom("public.category")
			.where("id", "=", id)
			.executeTakeFirstOrThrow();

		return c.json(result);
	},
);

export { route as categoryRouter };
