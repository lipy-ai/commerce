import { Hono } from "hono";
import z from "zod";
import { db } from "@/db";
import { COUPON_TYPE } from "@/db/schema";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";

const couponSchema = z.object({
	title: z.string(),
	discountType: z.enum(["percent", "flat"]),
	discountValue: z.coerce.number().min(0),
	minimumOrderValue: z.coerce.number().min(0),
	type: z.enum(COUPON_TYPE),
});

export const merchantCouponRoute = new Hono<ServerContext>()
	.get("/", async (c) => {
		const sess = c.get("session");

		const result = await db
			.selectFrom("coupons")
			.where("storeId", "=", sess?.activeStoreId!)
			.selectAll()
			.execute();

		return c.json(result);
	})
	.get(
		"/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			const sess = c.get("session");
			const { id } = c.req.param();

			const result = await db
				.selectFrom("coupons")
				.where("storeId", "=", sess?.activeStoreId!)
				.where("id", "=", id)
				.selectAll()
				.executeTakeFirstOrThrow();

			return c.json(result);
		},
	)
	.post("/", zValidator("json", couponSchema), async (c) => {
		const sess = c.get("session");
		const val = c.req.valid("json");

		const result = await db
			.insertInto("coupons")
			.values({
				id: crypto.randomUUID(),
				storeId: sess?.activeStoreId!,
				...val,
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return c.json(result);
	})
	.patch(
		"/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		zValidator("json", couponSchema),
		async (c) => {
			const sess = c.get("session");
			const { id } = c.req.param();
			const val = c.req.valid("json");

			const result = await db
				.updateTable("coupons")
				.set(val)
				.where("storeId", "=", sess?.activeStoreId!)
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow();

			return c.json(result);
		},
	);
