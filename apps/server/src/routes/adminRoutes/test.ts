import { Hono } from "hono";
import z from "zod";
import env from "@/env";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";

export const leadSchema = z.object({
	name: z.string(),
	type: z.string(),
	phone: z.string(),
	website: z.string().url().nullable(),
	rating: z.coerce.number(),
	ratingCount: z.coerce.number(),
	highlights: z.string(),
	address: z.string(),
	gmapurl: z.string().url().nullable(),
});
export const adminTestRoute = new Hono<ServerContext>().post(
	"/lead",
	zValidator("json", leadSchema),
	async (c) => {
		const url = env.GOOGLE_SHEET_LEAD;
		const query = c.req.valid("json");
		const user = c.get("user");

		await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				...query,
				time: new Date().toISOString(),
				generatedBy: user?.name || user?.email,
			}),
		});

		return c.json({ success: true });
	},
);
