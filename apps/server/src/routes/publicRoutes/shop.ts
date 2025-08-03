import { Hono } from "hono";
import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { z } from "zod";
import { db } from "@/db";
import env from "@/env";
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

		const radiusInMeters = 50_000; // 50km
		const resp = await db
			.selectFrom("store as s")
			.where("s.active", "=", true)
			.where("s.address", "is not", null)
			.where(
				sql<boolean>`ST_DWithin(s.location, ST_SetSRID(ST_MakePoint(${query.originLng}, ${query.originLat}), 4326)::geography, ${radiusInMeters})`,
			)
			.where(
				sql<boolean>`ST_Distance(s.location, ST_SetSRID(ST_MakePoint(${query.originLng}, ${query.originLat}), 4326)::geography) <= (s."deliveryDistance"+ 5) * 1000`,
			)
			.select([
				"id",
				"handle",
				"type",
				"name",
				"image",
				"address",
				"freeDeliveryDistance",
				"deliveryDistance",
			])
			.limit(25)
			.execute();

		if (resp.length === 0) {
			throw new HTTPError(404, { message: "No shops found!" });
		}

		const distanceMatrix = await getDistanceMatrix(
			{ lat: query.originLat, lng: query.originLng },
			resp.map((item) => ({
				lat: (item.address!.lat || 0) as number,
				lng: (item.address!.lng || 0) as number,
			})),
		);

		const shopData = resp.map((shop, i) => ({
			...shop,
			distance: distanceMatrix.rows[0].elements[i].distance || 0,
			duration: distanceMatrix.rows[0].elements[i].duration || 0,
		}));

		const nearbyShops = shopData.filter((shop) => {
			return Number(shop.distance.value) < (shop.deliveryDistance + 5) * 1000;
		});

		nearbyShops.sort((a, b) => {
			return Number(a.distance.value) - Number(b.distance.value);
		});

		return c.json(nearbyShops);
	})

	.get(
		"/:handle",
		zValidator("param", z.object({ handle: z.string() })),
		async (c) => {
			const { handle } = c.req.valid("param");
			const data = await db
				.selectFrom("store")
				.where("handle", "=", handle)
				.select([
					"id",
					"handle",
					"image",
					"address",
					"phone",
					"email",
					"openingHour",
					"closingHour",
					"name",
					"description",
					"createdAt",
					"type",
					"freeDeliveryDistance",
				])
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
