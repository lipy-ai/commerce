import { db } from "@/db";
import { STORE_TYPE } from "@/db/schema";
import { HTTPError } from "@/lib/exception";
import { idGenerate } from "@/lib/generateId";
import { zValidator } from "@/middlewares/validator";
import { emailSchema, listZodSchema, phoneSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres"; // Use 'mysql' or 'sqlite' if needed
import slugify from "slugify";
import { z } from "zod";
import { coreAddressSchema } from "./address";

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

const route = new Hono<ServerContext>()
	/**
	 * Gets All Shops
	 */
	.get("/", zValidator("query", schema), async (c) => {
		const q = c.req.valid("query");

		let query = db.selectFrom("store").where("active", "=", true);

		if (q.type && q.type !== "all") {
			query = query.where("type", "=", q.type);
		}

		const d = await query.selectAll().execute();

		return c.json(d || []);
	})

	.get(
		"/:handle",
		zValidator("param", z.object({ handle: z.string() })),
		async (c) => {
			const { handle } = c.req.valid("param");
			const d = await db
				.selectFrom("store")
				.where("handle", "=", handle)
				.selectAll()
				.executeTakeFirst();

			if (!d) {
				throw new HTTPError(404, { message: "Store not found!" });
			}
			return c.json(d || []);
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
					createdAt: new Date(),
				})
				.returningAll()
				.executeTakeFirst();

			if (!store)
				throw new HTTPError(400, { message: "Failed to create store." });

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
	});

export { route as shopRoute };
