import { Hono } from "hono";
import { sql } from "kysely";
import slugify from "slugify";
import { Identity } from "twilio/lib/twiml/VoiceResponse";
import z from "zod";
import { db } from "@/db";
import { STORE_TYPE } from "@/db/schema";
import { updateSession } from "@/helpers/session";
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
	image: z.string().optional(),
});

export const storeValidator = z.object({
	limit: z.coerce.number().max(100),
	page: z.coerce.number().min(1),
	q: z.string().optional(),
});
export const adminStoreRoute = new Hono<ServerContext>()
	.post("/", zValidator("json", storeSchema), async (c) => {
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
	})
	.get("/", zValidator("query", storeValidator), async (c) => {
		const { limit, page, q } = c.req.valid("query");

		const offset = limit * (page - 1);

		const query = db.selectFrom("store as s").$if(!!q, (qb) => {
			const words = q!.trim().split(/\s+/);
			return words.reduce(
				(acc, word) => acc.where("s.name", "ilike", `%${word}%`),
				qb,
			);
		});

		const countPromise = query
			.select(sql<number>`count(*)`.as("total_count"))
			.executeTakeFirst();

		const resultsPromise = query
			.select([
				"s.id",
				"s.name",
				"s.handle",
				"s.image",
				"s.type",
				"s.createdAt",
			])
			.orderBy("createdAt desc")
			.limit(limit)
			.offset(offset)
			.execute();

		const [countResult, items] = await Promise.all([
			countPromise,
			resultsPromise,
		]);

		const totalCount = countResult?.total_count ?? 0;

		const totalPages = Math.ceil(totalCount / limit);

		return c.json({ items, page, limit, totalPages, totalResults: totalCount });
	})
	.get(
		"/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			const id = c.req.param("id");
			const store = await db
				.selectFrom("store")
				.where("id", "=", id)
				.selectAll()
				.executeTakeFirstOrThrow();
			return c.json(store);
		},
	)
	.patch(
		"/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		zValidator("json", storeSchema.partial()),
		async (c) => {
			const vals = c.req.valid("json");
			const id = c.req.param("id");
			const store = await db
				.updateTable("store")
				.set({
					...vals,
					...(vals?.address?.lat &&
						vals?.address?.lng && {
							location: sql`ST_SetSRID(ST_MakePoint(${vals.address.lng}, ${vals.address.lat}), 4326)::geography`,
						}),
				})
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow();
			return c.json(store);
		},
	)
	.patch(
		"/:id/get-access",
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			try {
				const id = c.req.param("id");
				const session = c.get("session");
				const user = c.get("user");

				console.log("Store ID:", id);

				await updateSession(c, {
					session: {
						...(session as any),
						activeStoreId: id,
						activeStoreRole: "owner",
					},
					user,
				});

				return c.json({ success: true }, 200);
			} catch (err) {
				console.log("Error aa gaya");
				console.error("Error in get-access:", err);
				return c.json({ success: false, error: String(err) }, 500);
			}
		},
	);
