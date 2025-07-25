import { db } from "@/db";
import { STORE_TYPE } from "@/db/schema";
import env from "@/env";
import { updateSession } from "@/helpers/session";
import { HTTPError } from "@/lib/exception";
import { idGenerate } from "@/lib/generateId";
import { zValidator } from "@/middlewares/validator";
import { emailSchema, listZodSchema, phoneSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { isBefore } from "date-fns";
import { Hono } from "hono";
import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
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
});

const schema = z.object({
	type: z.enum([...STORE_TYPE, "all"] as [string, ...string[]]).optional(),
});

const shopSearchSchema = z.object({
	originLat: z.coerce.number(),
	originLng: z.coerce.number(),
});

type LatLang = {
	lat: number;
	lng: number;
};

const getDistanceMatrix = async (
	origin: LatLang,
	destinations: LatLang[],
	options?: {
		mode?: "driving" | "walking" | "bicycling" | "transit";
		units?: "metric" | "imperial";
	},
) => {
	const mode = options?.mode || "driving";
	const units = options?.units || "metric";
	const originStr = `${origin.lat},${origin.lng}`;
	const destinationsStr = destinations
		.map((d) => `${d.lat},${d.lng}`)
		.join("|");

	const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=${units}&origins=${originStr}&destinations=${destinationsStr}&mode=${mode}&key=${env.GOOGLE_MAPS_API_KEY}`;

	const response = await fetch(url);

	if (!response.ok) {
		console.log("Response", response);
		throw new Error(
			`Something went wrong while fetching the shops, ${response.status}`,
		);
	}

	const data = await response.json();

	if (data.status !== "OK") {
		console.log("Data", data);
		throw new Error(
			`Something went wrong while fetching the shops, ${data.status}`,
		);
	}

	return data;
};

const route = new Hono<ServerContext>()
	/**
	 * Gets All Shops
	 */

	.get("/", zValidator("query", shopSearchSchema), async (c) => {
		const query = c.req.valid("query");

		const resp = await db
			.selectFrom("store")
			.where("active", "=", true)
			.where("store.address", "is not", null)
			.select(["id", "handle", "type", "name", "image", "address", "phone"])
			.limit(25)
			.execute();

		const distanceMatrix = await getDistanceMatrix(
			{ lat: query.originLat, lng: query.originLng },
			resp.map((item) => ({
				lat: item.address!.lat as number,
				lng: item.address!.lng as number,
			})),
		);

		const shopData = resp.map((shop, i) => ({
			...shop,
			distance: distanceMatrix.rows[0].elements[i].distance,
			duration: distanceMatrix.rows[0].elements[i].duration,
		}));

		return c.json(shopData);
	})

	.get(
		"/:handle",
		zValidator("param", z.object({ handle: z.string() })),
		async (c) => {
			const { handle } = c.req.valid("param");
			const data = await db
				.selectFrom("store")
				.where("handle", "=", handle)
				.selectAll()
				.executeTakeFirstOrThrow();

			return c.json(data);
		},
	)
	.get(
		"/:storeHandle/categories",
		zValidator("param", z.object({ storeHandle: z.string() })),
		zValidator("query", listZodSchema),
		async (c) => {
			const { storeHandle } = c.req.valid("param");
			const { limit, page } = c.req.valid("query");
			const offset = limit * (page - 1);

			const r = db
				.selectFrom("storeInventory as si")
				.leftJoin("store as s", "s.id", "si.storeId")
				.where("s.handle", "=", storeHandle)
				.rightJoin("productVariant as pv", "pv.id", "si.productVariant")
				.rightJoin("product as p", "p.id", "pv.productId")
				.groupBy("p.id")
				.where("si.active", "=", true)
				.select((eb) => [
					"p.id",
					"p.title",
					"p.thumbnail",
					"p.category",
					sql`ROW_NUMBER() OVER (PARTITION BY p.category ORDER BY p.id)`.as(
						"rn",
					),
					eb.fn
						.jsonAgg(
							jsonBuildObject({
								id: eb.ref("pv.id"),
								inventoryId: eb.ref("si.id"),
								price: eb.fn.coalesce(eb.ref("si.price")),
								maxPrice: eb.ref("pv.price"),
								unit: eb.ref("pv.unit"),
								productId: eb.ref("pv.productId"),
								inStock: eb
									.case()
									.when("si.stock", "=", 0)
									.then(false)
									.when("si.stock", "=", -1)
									.then(true)
									.when("si.stock", ">", 0)
									.then(true)
									.else(false)
									.end(),
							}),
						)
						.as("variants"),
				])
				.as("limited_products");

			const result = await db
				.selectFrom(r)
				.innerJoin("category", "category.id", "limited_products.category")
				.where("limited_products.rn", "<=", 6)
				.select((eb) => [
					"category.id",
					"category.title",
					"category.image",
					"category.slug",
					eb.fn.jsonAgg("limited_products").as("products"),
				])
				.groupBy("category.id")
				.limit(limit)
				.offset(offset)
				.execute();

			return c.json({
				items: result,
				page,
				limit,
				hasMore: result.length === limit,
			});
		},
	)
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

			await updateSession(session?.token!, {
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

					await updateSession(session?.token!, {
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

export { route as shopRoute };
