import { sql } from "kysely";
import { db } from "@/db";
import env from "@/env";
import { delCache, getOrCache } from "@/services/cache";

const key = "feed:";
export const feedCacheKey = (origin: { lat: number; lng: number }) =>
	`${key}${origin.lat}-${origin.lng}`;

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
export const getFeedStores = async (origin: { lat: number; lng: number }) => {
	return await getOrCache({
		key: feedCacheKey(origin),

		cacheMissFn: async () => {
			const radiusInMeters = 50_000; // 50km
			const resp = await db
				.selectFrom("store as s")
				.where("s.active", "=", true)
				.where("s.address", "is not", null)
				.where(
					sql<boolean>`ST_DWithin(s.location, ST_SetSRID(ST_MakePoint(${origin.lng}, ${origin.lat}), 4326)::geography, ${radiusInMeters})`,
				)
				.where(
					sql<boolean>`ST_Distance(s.location, ST_SetSRID(ST_MakePoint(${origin.lng}, ${origin.lat}), 4326)::geography) <= (s."deliveryDistance"+ 5) * 1000`,
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

			if (resp.length === 0) return;

			const distanceMatrix = await getDistanceMatrix(
				{ lat: origin.lat, lng: origin.lng },
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

			return nearbyShops;
		},

		errorName: "Feed not found!",
	});
};

export const delFeed = async (origin: { lat: number; lng: number }) => {
	await delCache(feedCacheKey(origin));
};
