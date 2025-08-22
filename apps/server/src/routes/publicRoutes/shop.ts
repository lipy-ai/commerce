import { Hono } from "hono";
import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { z } from "zod";
import { db } from "@/db";
import env from "@/env";
import { getStore } from "@/helpers/store";
import { getFeedStores } from "@/helpers/storeFeed";
import { HTTPError } from "@/lib/exception";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";

const shopSearchSchema = z.object({
	originLat: z.coerce.number(),
	originLng: z.coerce.number(),
});

type LatLang = {
	lat: number;
	lng: number;
};

export const getDistanceMatrix = async (
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

	const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=${units}&origins=${originStr}&destinations=${destinationsStr}&mode=${mode}&key=${env.GOOGLE_MAP_API_KEY}`;

	const response = await fetch(url);

	if (!response.ok) {
		console.log(response);
		throw new Error(
			`Something went wrong while fetching the shops, ${response.status}`,
		);
	}

	const data = await response.json();

	if (data.status !== "OK") {
		console.log(data);
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

		const nearbyShops = await getFeedStores({
			lat: query.originLat,
			lng: query.originLng,
		});
		return c.json(nearbyShops);
	})
	.get(
		"/id/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			const { id } = c.req.valid("param");
			const store = await getStore(id);
			return c.json(store.handle);
		},
	)
	.get(
		"/:handle",
		zValidator("param", z.object({ handle: z.string() })),
		async (c) => {
			const { handle } = c.req.valid("param");

			const data = await db
				.selectFrom("store as s")
				.leftJoin("coupons as c", "s.id", "c.storeId")
				.where("s.handle", "=", handle)
				.where("s.active", "=", true)
				.select((eb) => [
					"s.id",
					"s.handle",
					"s.image",
					"s.address",
					"s.phone",
					"s.email",
					"s.openingHour",
					"s.closingHour",
					"s.name",
					"s.description",
					"s.createdAt",
					"s.type",
					"s.freeDeliveryDistance",
					"s.status",
					eb.fn
						.jsonAgg(
							jsonBuildObject({
								id: eb.ref("c.id"),
								title: eb.ref("c.title"),
								type: eb.ref("c.type"),
							}),
						)
						.filterWhere("c.id", "is not", null)
						.as("coupons"),
				])
				.groupBy("s.id")
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
				.rightJoin("productVariant as pv", "pv.id", "si.variantId")
				.rightJoin("product as p", "p.id", "pv.productId")
				.groupBy("p.id")
				.where("si.active", "=", true)
				.select((eb) => [
					"p.id",
					"p.title",
					"p.thumbnail",
					"p.category",
					"p.summary",
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
				// .where("limited_products.rn", "<=", 6)
				.select((eb) => [
					"category.id",
					"category.title",
					"category.image",
					"category.slug",
					eb.fn.jsonAgg("limited_products").as("products"),
				])
				.groupBy("category.id")
				// .limit(limit)
				.offset(offset)
				.execute();

			return c.json({
				items: result,
				page,
				limit,
				hasMore: result.length === limit,
			});
		},
	);

export { route as shopRoute };
