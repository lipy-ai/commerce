import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import z from "zod";

export const posStoreRoute = new Hono<ServerContext>().get(
	"/:handle",
	zValidator("param", z.object({ handle: z.string() })),
	async (c) => {
		const { handle } = c.req.valid("param");
		const data = await db
			.selectFrom("store")
			.where("handle", "=", handle)
			.select([
				"id",
				"handle",
				"image",
				"address",
				"phone",
				"email",
				"openingHour",
				"closingHour",
				"name",
				"description",
				"createdAt",
				"type",
				"freeDeliveryDistance",
				"payments",
			])
			.executeTakeFirstOrThrow();

		return c.json(data);
	},
);
