import { db } from "@/db";
import { STORE_TYPE } from "@/db/schema";
import { ERR_CODES, HTTPError } from "@/lib/exception";
import { zValidator } from "@/middlewares/validator";
import { emailSchema, phoneSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";
import { coreAddressSchema } from "../address";

export const storeSchema = z.object({
	name: z.string(),
	email: emailSchema,
	phone: phoneSchema,
	type: z.enum(STORE_TYPE),
	address: coreAddressSchema,
	payments: z
		.object({
			upiIds: z.array(z.object({ name: z.string(), id: z.string() })).min(1),
		})
		.optional(),
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");

		if (!session?.activeStoreId) {
			throw new HTTPError(401, { code: ERR_CODES.NO_ACTIVE_STORE });
		}
		const result = await db
			.selectFrom("store")

			.where("id", "=", session?.activeStoreId!)

			.selectAll()
			.executeTakeFirst();

		if (!result) {
			throw new HTTPError(401, { code: ERR_CODES.NO_ACTIVE_STORE });
		}

		return c.json(result);
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
