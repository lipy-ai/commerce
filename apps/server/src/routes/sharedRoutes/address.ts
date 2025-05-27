import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const addressSchema = z.object({
	name: z.string(),
	tag: z.enum(["home", "work", "other"]),
	line1: z.string().min(1),
	line2: z.string(),
	city: z.string().min(1),
	state: z.string().min(1),
	country: z.string().min(1),
	lat: z.number(),
	lng: z.number(),
	phone: z.string().optional(),
	postal_code: z.string().min(1),
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");
		const address = await db
			.selectFrom("address")
			.selectAll()
			.where("address.user_id", "=", session?.userId!)
			.execute();
		return c.json(address);
	})
	.delete(
		"/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			const session = c.get("session");
			const { id } = c.req.valid("param");
			const address = await db
				.deleteFrom("address")
				.where("id", "=", id)
				.where("user_id", "=", session?.userId!)
				.returning(["id"])
				.executeTakeFirst();
			return c.json(address);
		},
	)
	.post("/", zValidator("json", addressSchema), async (c) => {
		const session = c.get("session");
		const values = c.req.valid("json");
		const address = await db
			.insertInto("address")
			.values({ ...values, id: crypto.randomUUID(), user_id: session?.userId! })
			.returning(["id"])
			.executeTakeFirst();
		return c.json(address);
	})
	.patch(
		"/:id",
		zValidator("json", addressSchema),
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			const session = c.get("session");
			const values = c.req.valid("json");
			const { id } = c.req.valid("param");
			const address = await db
				.updateTable("address")
				.where("id", "=", id)
				.where("user_id", "=", session?.userId!)
				.set({
					...values,
				})
				.returning(["id"])
				.executeTakeFirst();
			return c.json(address);
		},
	);

export { route as addressRoute };
