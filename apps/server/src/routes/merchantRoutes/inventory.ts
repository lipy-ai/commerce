import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

export const merchantInventoryRoute = new Hono<ServerContext>().patch(
	"/:id",
	zValidator(
		"param",
		z.object({
			id: z.string(),
		}),
	),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			console.log("hit");

			await new Promise((resolve) => setTimeout(resolve, 3000));

			console.log("after sleep");

			return c.json({ t: id });
		} catch (err) {
			console.error("ERROR:", err);
			throw err;
		}
	},
);
