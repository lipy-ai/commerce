import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import { listZodSchema } from "@/schema/common";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { type Expression, type SqlBool, sql } from "kysely";

export const merchantCustomerRoute = new Hono<ServerContext>().get(
	"/",
	zValidator("query", listZodSchema),
	async (c) => {
		const { limit, page, q } = c.req.valid("query");
		const activeStoreId = c.var.session?.activeStoreId!;
		const offset = limit * (page - 1);
		const query = db
			.selectFrom("customer as c")
			.where("c.storeId", "=", activeStoreId)
			.leftJoin("user as u", "u.id", "c.userId")

			.$if(!!q, (e) =>
				e.where((eb) => {
					const words = q!.trim().split(/\s+/);

					const wordMatches = words.map((word) =>
						eb("u.name", "ilike", `%${word}%`),
					);
					return eb.or([
						eb.and(wordMatches), // All words should be in u.name
						eb("u.name", "ilike", `%${q}%`),
						eb("u.email", "ilike", `%${q}%`),
						eb("u.phoneNumber", "ilike", `%${q}%`),
					]);
				}),
			);

		const countPromise = query
			.select(sql<number>`count(*)`.as("total_count"))
			.executeTakeFirst();

		const resultsPromise = query
			.select(["u.id", "u.email", "u.phoneNumber", "u.name", "u.image"])
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
	},
);
// .get(
// 	"/:id",
// 	zValidator(
// 		"param",
// 		z.object({
// 			id: z.string(),
// 		}),
// 	),
// 	async (c) => {
// 		const { id } = c.req.valid("param");
// 		const activeStoreId = c.var.session?.activeStoreId!;

// 		const result = await db
// 			.selectFrom("customer as c")
// 			.where("c.userId", "=", id)
// 			.where("c.storeId", "=", activeStoreId)
// 			.selectAll(["c"])
// 			// .select((eb) => [eb.fn.toJson("c").as("category")])
// 			.executeTakeFirstOrThrow();
// 		return c.json(result);
// 	},
// );
// .post(
// 	"/",
// 	zValidator(
// 		"json",
// 		z.object({
// 			custom: z
// 				.object({
// 					name: z.string(),
// 					phoneNumber: z.string(),
// 					email: z.string().email(),
// 					address: z.string(),
// 				})
// 				.optional(),
// 			userId: z.string().optional(),
// 		}),
// 	),
// 	async (c) => {
// 		const { custom, userId } = c.req.valid("json");

// 		const storeId = c.var.session?.activeStoreId!;

// 		if (userId) {
// 			await db
// 				.insertInto("customer")
// 				.values({
// 					userId,
// 					storeId,
// 				})
// 				.onConflict((oc) => oc.doNothing())
// 				.execute();
// 		}

// 		if (custom) {
// 			const { name, email, phoneNumber, address } = custom;

// 			await db.transaction().execute(async (trx) => {
// 				const user = await trx
// 					.insertInto("user")
// 					.values({
// 						id: crypto.randomUUID(),
// 						name,
// 						email,
// 						phoneNumber,
// 						emailVerified: false,
// 						phoneNumberVerified: false,
// 						createdAt: new Date(),
// 						updatedAt: new Date(),
// 					})
// 					.onConflict((oc) => oc.doNothing())
// 					.returning("id")
// 					.executeTakeFirstOrThrow();

// 				await db
// 					.insertInto("customer")
// 					.values({
// 						userId: user.id,
// 						storeId,
// 					})
// 					.onConflict((oc) => oc.doNothing())
// 					.execute();
// 			});
// 		}
// 	},
// );
