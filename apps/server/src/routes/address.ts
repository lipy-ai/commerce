import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

export const addressSchema = z.object({
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
	postalCode: z.string().min(1),
	metadata: z
		.object({
			building: z.string().min(1),
		})
		.optional(),
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");
		const address = await db
			.selectFrom("userAddress")
			.where("userAddress.userId", "=", session?.userId!)
			.rightJoin("address", "address.id", "userAddress.id")
			.selectAll(["address"])
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
				.deleteFrom("userAddress")
				.where("id", "=", id)
				.where("userId", "=", session?.userId!)
				.returning(["id"])
				.executeTakeFirst();
			return c.json(address);
		},
	)
	.post("/", zValidator("json", addressSchema), async (c) => {
		const session = c.get("session");
		const values = c.req.valid("json");
		const address = await db.transaction().execute(async (trx) => {
			const address = await trx
				.insertInto("address")
				.values({
					id: crypto.randomUUID(),
					...values,
				})
				.returning(["id"])
				.executeTakeFirst();

			if (!address) throw Error("Failed to create address");

			await trx
				.insertInto("userAddress")
				.values({
					id: address.id,
					userId: session?.userId!,
				})
				.returning(["id"])
				.executeTakeFirst();

			return address;
		});

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
				.rightJoin("userAddress", "address.id", "userAddress.id")
				.where("userAddress.userId", "=", session?.userId!)
				.set({
					...values,
				})
				.returning(["id"])
				.executeTakeFirst();
			return c.json(address);
		},
	);

export { route as addressRoute };
