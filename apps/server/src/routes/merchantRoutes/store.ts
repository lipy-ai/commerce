import { db } from "@/db";
import { STORE_TYPE } from "@/db/schema";
import { idGenerate } from "@/lib/generateId";
import { zValidator } from "@/middlewares/validator";
import { emailSchema, phoneSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import slugify from "slugify";
import { z } from "zod";
import { coreAddressSchema } from "../address";
const storeSchema = z.object({
	name: z.string(),
	email: emailSchema,
	phone: phoneSchema,
	type: z.enum(STORE_TYPE),
	address: coreAddressSchema,
	payments: z.object({
		upiIds: z.array(z.object({ name: z.string(), id: z.string() })).min(1),
	}),
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");

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
		const { payments, ...vals } = c.req.valid("json");

		const store = await db.transaction().execute(async (trx) => {
			const store = await trx
				.insertInto("store")
				.values({
					...vals,
					id: crypto.randomUUID(),
					handle: `${slugify(vals.name)}-${idGenerate()}`,
					createdAt: new Date(),
				})
				.returning(["id"])
				.executeTakeFirst();

			if (!store) throw Error("Failed to create store");

			await trx
				.insertInto("storePayments")
				.values({
					id: store.id,
					acceptedPayments: ["cod"],
					upiIds: payments.upiIds,
				})
				.execute();

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
		c.get("emitter").emit(c, "store:created", store);
		return c.json(store);
	})
	.patch("/", zValidator("json", storeSchema), async (c) => {
		const session = c.get("session");
		const values = c.req.valid("json");
		await db
			.updateTable("store")
			.where("id", "=", session?.activeStoreId!)
			.set(values)
			.execute();

		return c.json({ success: true });
	});

export { route as merchantStoreRoute };
