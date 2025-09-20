import { Hono } from "hono";
import { sql } from "kysely";
import slugify from "slugify";
import z from "zod";
import { db } from "@/db";
import { STORE_TYPE } from "@/db/schema";
import { idGenerate } from "@/lib/generateId";
import { zValidator } from "@/middlewares/validator";
import { emailSchema, phoneSchema, timeSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { coreAddressSchema } from "../loggedRoutes/address";

export const storeSchema = z.object({
	name: z.string(),
	address: coreAddressSchema,
	email: emailSchema,
	phone: phoneSchema,
	type: z.enum(STORE_TYPE),
	openingHour: timeSchema,
	closingHour: timeSchema,
});
export const adminStoreRoute = new Hono<ServerContext>().post(
	"/",
	zValidator("json", storeSchema),
	async (c) => {
		const vals = c.req.valid("json");

		const store = await db
			.insertInto("store")
			.values({
				...vals,
				...(vals.address.lat &&
					vals.address.lng && {
						location: sql`ST_SetSRID(ST_MakePoint(${vals.address.lng}, ${vals.address.lat}), 4326)::geography`,
					}),
				id: crypto.randomUUID(),
				createdAt: sql`now()`,
				deliveryChargePerKm: 10,
				handle: `${slugify(vals.name, { lower: true })}-${idGenerate({ length: 5, alphabet_type: "0-9/a-z" })}`,
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		c.get("emitter").emit(c, "store:created", store);
		return c.json(store);
	},
);
