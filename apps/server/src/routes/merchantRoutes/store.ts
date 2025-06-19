import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const storeSchema = z.object({
	name: z.string(),
	handle: z.string(),
	description: z.string(),
	email: z.string(),
	phone: z.string(),
	image: z.string(),
	active: z.boolean().default(true),
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");
		console.log(session);
		if (!session?.activeStoreId) {
			throw new HTTPException(404, { message: "No active store found!" });
		}
		const result = await db
			.selectFrom("store")

			.where("id", "=", session?.activeStoreId!)

			.selectAll()
			.executeTakeFirstOrThrow();
		return c.json(result);
	})
	.post("/", zValidator("json", storeSchema), async (c) => {
		const session = c.get("session");
		const values = c.req.valid("json");
		if (session?.activeStoreId) {
			throw new HTTPException(400, { message: "Store already exists!" });
		}

		const store = await db.transaction().execute(async (trx) => {
			const store = await trx
				.insertInto("store")
				.values({
					id: crypto.randomUUID(),
					createdAt: new Date(),
					...values,
				})
				.returning(["id"])
				.executeTakeFirst();

			if (!store) throw Error("Failed to create store");

			await trx
				.insertInto("storeMember")
				.values({
					id: crypto.randomUUID(),
					storeId: store.id,
					userId: session?.userId!,
					role: "owner",
					createdAt: new Date(),
				})
				.executeTakeFirst();

			return store;
		});
		return c.json(store);
	})
	.patch("/", zValidator("json", storeSchema), async (c) => {
		const session = c.get("session");
		const values = c.req.valid("json");
		await db
			.updateTable("store")
<<<<<<< HEAD
			.where("store.id", "=", session?.activeOrganizationId!)
=======
		.where("id", "=", session?.activeStoreId!)
>>>>>>> f652621 (updates)
			.set(
				...values,)
			.execute()

		return c.json({ success: true });
	});

export { route as merchantStoreRoute };
