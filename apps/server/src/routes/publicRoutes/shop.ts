import { db } from "@/db";
import { STORE_TYPE } from "@/db/schema";
import env from "@/env";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";

import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { z } from "zod";

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
	);

export { route as shopRoute };
