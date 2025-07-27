import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { sql } from "kysely";
import { z } from "zod";

export const coreAddressSchema = z.object({
	line1: z.string().min(1),
	line2: z.string(),
	city: z.string().min(1),
	state: z.string().min(1),
	country: z.string().min(1),
	postalCode: z.string().min(1),
	lat: z.number().optional(),
	lng: z.number().optional(),
});

export const addressSchema = z.object({
	name: z.string(),
	tag: z.enum(["home", "work", "other"]),
	phone: z.string().optional(),
	metadata: z
		.object({
			building: z.string().min(1),
		})
		.optional(),
	...coreAddressSchema.shape,
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");
		const address = await db
			.selectFrom("userAddress")
			.where("userAddress.userId", "=", session?.userId!)
			.rightJoin("address", "address.id", "userAddress.id")
			.selectAll(["address"])
			// .select([
			// 	sql<number>`ST_Y(location::geometry)`.as("lat"),
			// 	sql<number>`ST_X(location::geometry)`.as("lng"),
			// ])
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
		const { lat, lng, ...values } = c.req.valid("json");
		const address = await db.transaction().execute(async (trx) => {
			const address = await trx
				.insertInto("address")
				.values({
					id: crypto.randomUUID(),
					// location: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`,
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
			const { lat, lng, ...values } = c.req.valid("json");
			const { id } = c.req.valid("param");

			const address = await db
				.updateTable("address")
				.set({
					// location: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`,
					...values,
				})
				.where("id", "=", id)
				.where((eb) =>
					eb.exists(
						db
							.selectFrom("userAddress")
							.select("id")
							.where("userAddress.id", "=", id)
							.where("userAddress.userId", "=", session?.userId!),
					),
				)
				.returning(["id"])
				.executeTakeFirst();

			return c.json(address);
		},
	)
	// FIXME: remove this
	.get("/primary", async (c) => {
		const user = c.get("user");

		if (!user) {
			return c.json(null);
		}

		const result = await db
			.selectFrom("user")
			.leftJoin("userAddress", "userAddress.id", "user.address")
			.leftJoin("address", "address.id", "userAddress.id")
			.where("user.id", "=", user?.id!)
			.selectAll(["address"])
			// .select([
			// 	sql<number>`ST_Y(location::geometry)`.as("lat"),
			// 	sql<number>`ST_X(location::geometry)`.as("lng"),
			// ])
			.executeTakeFirstOrThrow();

		return c.json(result);
	});

export { route as addressRoute };
