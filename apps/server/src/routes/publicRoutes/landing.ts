import { Hono } from "hono";
import z from "zod";
import env from "@/env";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";

export const websiteLeadSchema = z.object({
	name: z.string(),
	phone: z.string(),
	address: z.string(),
	delivery: z.enum(["yes", "no"]),
});

export const publicLandingRoute = new Hono<ServerContext>().post(
	"/lead",
	zValidator("json", websiteLeadSchema),
	async (c) => {
		const url = env.GOOGLE_WEBSITE_LEAD;
		const query = c.req.valid("json");

		await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				...query,
				time: new Date().toISOString(),
			}),
		});

		return c.json({ success: true });
	},
);
