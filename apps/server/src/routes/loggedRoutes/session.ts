import { db } from "@/db";
import { HTTPError } from "@/lib/exception";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import z from "zod";

export const loggedInSessionRoute = new Hono<ServerContext>().get(
	"/invitation/:id",
	zValidator("param", z.object({ id: z.string().uuid() })),
	async (c) => {
		const { id } = c.req.valid("param");

		const inv = await db
			.selectFrom("storeInvitation as si")
			.where("si.id", "=", id)
			.leftJoin("store as s", "s.id", "si.storeId")
			.selectAll(["si"])
			.select(["s.image as storeImage", "s.name as storeName"])
			.executeTakeFirst();

		if (!inv) {
			throw new HTTPError(404, { message: "No invitation found!" });
		}
		return c.json(inv);
	},
);
