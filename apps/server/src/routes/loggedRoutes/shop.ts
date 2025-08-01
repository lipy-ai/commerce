import { db } from "@/db";
import { STORE_TYPE } from "@/db/schema";
import { updateSession } from "@/helpers/session";
import { HTTPError } from "@/lib/exception";
import { idGenerate } from "@/lib/generateId";
import { zValidator } from "@/middlewares/validator";
import { emailSchema, phoneSchema, timeSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { isBefore } from "date-fns";
import { Hono } from "hono";
import { sql } from "kysely";
import slugify from "slugify";
import { z } from "zod";
import { coreAddressSchema } from "../loggedRoutes/address";

export const storeSchema = z.object({
	name: z.string(),
	email: emailSchema,
	phone: phoneSchema,
	type: z.enum(STORE_TYPE),
	address: coreAddressSchema,
	payments: z.object({
		upiIds: z.array(z.object({ name: z.string(), id: z.string() })).min(1),
	}),
	openingHour: timeSchema,
	closingHour: timeSchema,
	deliveryDistance: z.number().int().min(0).max(100),
	freeDeliveryDistance: z.number().int().min(0).max(100),
	deliveryChargePerKm: z.number().int().min(0).max(50).optional(),
	refunds: z.object({
		enabled: z.boolean(),
		content: z.string().optional(),
	}),
	replacements: z.object({
		enabled: z.boolean(),
		content: z.string().optional(),
	}),
	gstTax: z
		.enum(["0", "5", "12", "18", "27"])
		.transform((val) => Number.parseInt(val)),
});

export const loggedStoreRoute = new Hono<ServerContext>()
	.post("/", zValidator("json", storeSchema), async (c) => {
		const session = c.get("session");
		const user = c.get("user");

		const { payments, ...vals } = c.req.valid("json");

		const oldStore = await db
			.selectFrom("storeMember")
			.where("storeMember.userId", "=", session?.userId!)
			.executeTakeFirst();

		if (oldStore)
			throw new HTTPError(401, { message: "Store already exists!" });

		const store = await db.transaction().execute(async (trx) => {
			const store = await trx
				.insertInto("store")
				.values({
					...vals,
					...(vals.address.lat &&
						vals.address.lng && {
							location: sql`ST_SetSRID(ST_MakePoint(${vals.address.lng}, ${vals.address.lat}), 4326)::geography`,
						}),
					deliveryChargePerKm: 10,
					id: crypto.randomUUID(),
					handle: `${slugify(vals.name)}-${idGenerate()}`,
					createdAt: sql`now()`,
				})
				.returningAll()
				.executeTakeFirst();

			if (!store) {
				throw new HTTPError(400, { message: "Failed to create store." });
			}

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
					createdAt: sql`now()`,
				})
				.executeTakeFirst();

			console.log(session?.token);

			await updateSession(c, {
				session: {
					...(session as any),
					activeStoreId: store.id,
					activeStoreRole: "owner",
				},
				user,
			});

			return store;
		});

		c.get("emitter").emit(c, "store:created", store);
		return c.json(store);
	})
	.post(
		"/invitation/:id/:type",
		zValidator(
			"param",
			z.object({ id: z.string().uuid(), type: z.enum(["accept", "reject"]) }),
		),
		async (c) => {
			const user = c.get("user");
			const session = c.get("session");

			const { id, type } = c.req.valid("param");

			const inv = await db
				.selectFrom("storeInvitation")
				.where("id", "=", id)
				.selectAll()
				.executeTakeFirst();

			if (!inv) {
				throw new HTTPError(404, { message: "Invitation not found!" });
			}
			if (user?.email !== inv.email) {
				throw new HTTPError(404, {
					message: "User email mismatch!",
				});
			}

			if (isBefore(new Date(inv.expiresAt), new Date())) {
				throw new HTTPError(404, { message: "Invitation expired!" });
			}

			await db.transaction().execute(async (trx) => {
				await trx.deleteFrom("storeInvitation").where("id", "=", id).execute();
				if (type === "accept") {
					await trx
						.insertInto("storeMember")
						.values({
							id: crypto.randomUUID(),
							storeId: inv.storeId,
							userId: user.id,
							role: inv.role as any,
							createdAt: sql`now()`,
						})
						.execute();

					await updateSession(c, {
						session: {
							...(session as any),
							activeStoreId: inv.storeId,
							activeStoreRole: inv.role,
						},
						user,
					});
				}
			});

			return c.json({ success: true });
		},
	);
