import { clearSessionDataCookie } from "@/helpers/session";
import type { ServerContext } from "@/types";
import { Hono } from "hono";

export const loggedInSessionRoute = new Hono<ServerContext>().post(
	"/clear",
	async (c) => {
		await clearSessionDataCookie(c);
		return c.json({ success: true });
	},
);
