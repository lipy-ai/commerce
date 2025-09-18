import { Hono } from "hono";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { z } from "zod";
import { db } from "@/db";
import { getAllCategory } from "@/helpers/category";
import { getFeedStores } from "@/helpers/storeFeed";
import { HTTPError } from "@/lib/exception";
import { vibrate30sPattern } from "@/lib/vibrate";
import { zValidator } from "@/middlewares/validator";
import { firebase_messaging } from "@/services/firebase";
import type { ServerContext } from "@/types";

const schema = z.object({
	categorySlug: z.string().optional(),
	storeHandle: z.string().optional(),
	search: z.string().optional(),
});

const searchSchema = z.object({
	q: z.string().optional(),
	lat: z.coerce.number(),
	lng: z.coerce.number(),
});

const route = new Hono<ServerContext>()
	.post("/call", async (c) => {
		const tokens = [
			// "f60xymMTS328KUyjYCNFzO:APA91bHbqHTzZr8S40W0H8syTIwst_fGqEsSSSk4KmtG-4tR48Ppr5YUwyCp8pwJUvIfncRjxVD1IkT0lI8DW_FvkUp2zizTD2UF6VnIV1Poel-DQy1_2xQ",
			"8053429FC4BC4CAF3E1532E3A5826E511BA9099C0552BC35013EDEE47A4B2CFFF9E0FD1C470597F76A63D3623334ED588393C3CA1865FD7FA6AF4F005E203A532A822649F79CA8D5B3B4B762FDC4EF68",
		];

		await firebase_messaging
			.sendEachForMulticast({
				// data: { storeId, orderId: id },
				android: {
					priority: "high",
					notification: {
						channelId: "order",
						sound: "urgent.wav",
						priority: "max",
						vibrateTimingsMillis: vibrate30sPattern(),
						visibility: "public",
						icon: "ic_ico",
						color: "#ffffff",
					},
				},

				notification: {
					title: "New Order",
					body: `You have a new order from ${"customer"}`,
				},

				data: {
					channelId: "order",
					sound: "urgent.wav",
					title: "New Order",
					body: `You have a new order from "Kundan"`,
					largeIcon: "https://partners.lipy.in/logo/ico.png",
					duration: String(30 * 1000),
					showTimestamp: String(true),
					ongoing: String(true),
					showChronometer: String(true),
					chronometerDirection: "down",
					url: `https://partners.lipy.in/pos/order/${"orderId"}`,
				},

				apns: {
					headers: {
						"apns-priority": "5",
					},
					payload: {
						aps: {
							sound: {
								name: "urgent.wav",
								critical: true,
								volume: 0.7,
							},
						},
					},
				},
				tokens,
			})
			.then((r) => {
				if (r.failureCount === tokens.length) {
					throw new HTTPError(400, {
						message: "Failed to notify stores!",
						cause: r,
					});
				}
				if (r.failureCount > 0) {
					const failedTokens: string[] = [];
					r.responses.forEach((resp, idx) => {
						if (!resp.success) {
							failedTokens.push(tokens[idx]);
						}
					});
					console.log("List of tokens that caused failures: " + failedTokens);
				}
			});

		return c.json({ s: true });
	})
	.get("/", zValidator("query", schema), async (c) => {
		const q = c.req.valid("query");

		let query = db
			.selectFrom("storeInventory as si")
			.leftJoin("store as s", "s.id", "si.storeId")
			.rightJoin("productVariant as pv", "pv.id", "si.variantId")
			.rightJoin("product as p", "p.id", "pv.productId")
			.rightJoin("category as c", "p.category", "c.id")
			.groupBy(["p.id", "c.title", "c.id", "c.slug"]) // <-- fix here
			.orderBy("c.id")
			.where("si.active", "=", true);

		if (q.categorySlug) {
			query = query.where("c.slug", "=", q.categorySlug);
		}

		if (q.storeHandle) {
			query = query.where("s.handle", "=", q.storeHandle);
		}

		if (q.search) {
			query = query.where("p.title", "like", `%${q.search}%`);
		}

		const data = await query
			.select((eb) => [
				"p.id as id",
				"p.title",
				"p.thumbnail",
				"p.summary",
				"c.title as categoryTitle",
				"c.id as category",
				"c.slug as categorySlug",
				eb.fn
					.jsonAgg(
						jsonBuildObject({
							id: eb.ref("pv.id"),
							inventoryId: eb.ref("si.id"),
							price: eb.fn.coalesce(eb.ref("si.price")),
							maxPrice: eb.ref("pv.price"),
							unit: eb.ref("pv.unit"),
							productId: eb.ref("pv.productId"),
							inStock: eb.ref("si.inStock"),
						}),
					)
					.as("variants"),
			])
			.execute();

		return c.json(data || []);
	})
	.get(
		"/category/:name",
		zValidator("param", z.object({ name: z.string() })),
		async (c) => {
			const { name } = c.req.valid("param");
			let result = null;
			if (name === "all") {
				result = await getAllCategory();
			}
			return c.json(result);
		},
	)
	.get(
		"/singleProduct",
		zValidator(
			"query",
			z.object({ productId: z.string().uuid(), handle: z.string() }),
		),
		async (c) => {
			const q = c.req.valid("query");

			const data = await db
				.selectFrom("storeInventory as si")
				.rightJoin("productVariant as pv", "pv.id", "si.variantId")
				.rightJoin("product as p", "p.id", "pv.productId")
				.rightJoin("store as s", "s.id", "si.storeId")
				.groupBy(["p.id", "si.storeId"])
				.where("s.handle", "=", q.handle)
				.where("p.id", "=", q.productId)
				.where("si.active", "=", true)
				.select((eb) => [
					"p.id as id",
					"p.title as title",
					"p.summary as summary",
					"p.thumbnail as thumbnail",
					"si.storeId as storeId",
					"p.category as category",
					"p.images",
					"p.highlights",
					eb.fn
						.jsonAgg(
							jsonBuildObject({
								id: eb.ref("pv.id"),
								inventoryId: eb.ref("si.id"),
								price: eb.fn.coalesce(eb.ref("si.price")),
								maxPrice: eb.ref("pv.price"),
								unit: eb.ref("pv.unit"),
								productId: eb.ref("pv.productId"),
								inStock: eb.ref("si.inStock"),
							}),
						)
						.as("variants"),
				])
				.executeTakeFirstOrThrow();

			return c.json(data);
		},
	)
	.get("/search", zValidator("query", searchSchema), async (c) => {
		const query = c.req.valid("query");

		const nearbyShops = await getFeedStores({
			lat: query.lat,
			lng: query.lng,
		});

		const storeIds = nearbyShops.map((shop) => shop.id);

		const qb = db
			.selectFrom("storeInventory as si")
			.where("si.storeId", "in", storeIds)
			.where("si.active", "=", true)
			.rightJoin("store as s", "s.id", "si.storeId")
			.rightJoin("productVariant as pv", "pv.id", "si.variantId")
			.rightJoin("product as p", "p.id", "pv.productId")
			.$if(!!query.q, (qb) => {
				const words = query.q!.trim().split(/\s+/);
				return words.reduce(
					(acc, word) => acc.where("p.title", "ilike", `%${word}%`),
					qb,
				);
			});

		const data = await qb
			.select([
				"p.id as productId",
				"p.title",
				"p.thumbnail",
				"si.storeId",
				"s.handle",
				"s.name",
				"si.price",
				"pv.unit",
			])
			.groupBy([
				"p.id",
				"p.title",
				"p.thumbnail",
				"si.storeId",
				"s.handle",
				"s.name",
				"si.price",
				"pv.unit",
			])
			.limit(10)
			.execute();

		return c.json(data);
	})

	.get(
		"/:id/search",
		zValidator("param", z.object({ id: z.string().uuid() })),
		zValidator("query", z.object({ q: z.string().optional() })),
		async (c) => {
			const { q } = c.req.valid("query");
			const { id } = c.req.valid("param");
			const query = db
				.selectFrom("storeInventory as si")
				.where("si.storeId", "=", id)
				.rightJoin("productVariant as pv", "pv.id", "si.variantId")
				.rightJoin("product as p", "p.id", "pv.productId")
				.$if(!!q, (qb) => {
					const words = q!.trim().split(/\s+/);
					return words.reduce(
						(acc, word) => acc.where("p.title", "ilike", `%${word}%`),
						qb,
					);
				});

			const data = await query
				.select(["p.id as id", "p.title", "p.thumbnail"])
				.groupBy(["p.id"])
				.limit(10)
				.execute();
			return c.json(data);
		},
	);

export { route as productRoute };
