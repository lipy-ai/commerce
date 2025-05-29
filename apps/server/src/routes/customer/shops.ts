import { db } from "@/db";
import type { ServerContext } from "@/types";
import { Hono } from "hono";

const route = new Hono<ServerContext>().get("/", async (c) => {
	const shops = await db.selectFrom("org").selectAll().execute();

	return c.json(shops);
});

export { route as shopRoute };
