import { type DBTypes, db } from "@/db";
import { ORDER_STATUS, SUM_TYPE } from "@/db/schema";
import { HTTPError } from "@/lib/exception";
import { idGenerate } from "@/lib/generateId";
import { orderCalculator } from "@/lib/orderCalculators";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import type { Updateable } from "kysely";
import { z } from "zod";

const updateOrderSchema = z.object({
	items: z
		.array(
			z.object({
				inventoryId: z.string().uuid().optional(),
				variantId: z.string().optional(),
				productId: z.string().uuid().optional(),
				title: z.string(),
				thumbnail: z.string().optional(),
				unit: z.string(),
				qty: z.coerce.number().min(1),
				price: z.coerce.number().min(0),
				maxPrice: z.coerce.number().min(0).optional(),
			}),
		)
		.min(1),
	taxes: z.array(
		z.object({
			name: z.string(),
			amount: z.coerce.number(),
			sum: z.enum(SUM_TYPE),
		}),
	),
	discounts: z.array(
		z.object({
			name: z.string(),
			amount: z.coerce.number(),
			sum: z.enum(SUM_TYPE),
		}),
	),
});

const createOrderSchema = z.object({
	...updateOrderSchema.shape,
	status: z.enum(ORDER_STATUS),
});

export const posOrderRoute = new Hono<ServerContext>()
	.post("/", zValidator("json", createOrderSchema), async (c) => {
		const sess = c.get("session");
		const user = c.get("user");

		const { items, taxes, discounts, status } = c.req.valid("json");

		const calcs = orderCalculator({
			items,
			taxes,
			discounts,
		});

		await db
			.insertInto("orders")
			.values({
				...calcs,
				items,
				taxes,
				discounts,
				status,
				id: idGenerate(),
				pk: crypto.randomUUID(),
				storeId: sess?.activeStoreId!,
				currency: "inr",
				orderedAt: new Date(),
				timeline: [
					{
						content: "Order was created!",
						status: "created",
						userId: user?.id!,
						createdAt: new Date().toISOString(),
					},
				],
			})
			.executeTakeFirst();

		return c.json({ success: true });
	})
	.get(
		"/:id",
		zValidator(
			"param",
			z.object({
				id: z.string(),
			}),
		),
		async (c) => {
			const { id } = c.req.valid("param");
			const activeStoreId = c.var.session?.activeStoreId!;

			const data = await db
				.selectFrom("orders as o")
				.where("o.id", "=", id)
				.where("o.storeId", "=", activeStoreId)
				.selectAll(["o"])
				.executeTakeFirstOrThrow()
				.catch((c) => {
					throw new HTTPError(404, { message: "Order not found!" });
				});

			return c.json(data);
		},
	)
	.patch(
		"/:id",
		zValidator(
			"param",
			z.object({
				id: z.string(),
			}),
		),
		zValidator(
			"json",
			z.discriminatedUnion("type", [
				z.object({ type: z.literal("accept") }),
				z.object({ type: z.literal("packed") }),
				z.object({ type: z.literal("out_for_delivery") }),
				z.object({ type: z.literal("replaced") }),
				z.object({ type: z.literal("refunded") }),
				z.object({ type: z.literal("delivered"), otp: z.string() }),
				z.object({ type: z.literal("cancel"), reason: z.string() }),
				z.object({ type: z.literal("update"), ...updateOrderSchema.shape }),
			]),
		),
		async (c) => {
			const { id } = c.req.valid("param");
			const { type, ...data } = c.req.valid("json");
			const user = c.get("user");

			const ord = await db
				.selectFrom("orders")
				.where("id", "=", id)
				.selectAll()
				.executeTakeFirstOrThrow()
				.catch(() => {
					throw new HTTPError(404, { message: "Order not found!" });
				});

			let newOrd: Updateable<DBTypes["orders"]> = {};

			if (
				(["canceled"] satisfies (typeof ord.status)[]).includes(
					ord.status as any,
				)
			) {
				throw new HTTPError(400, { message: "Order canceled!" });
			}

			if (type === "update") {
				const { items, taxes, discounts } = data as z.infer<
					typeof updateOrderSchema
				>;
				if (items || taxes || discounts) {
					const calcs = orderCalculator({
						items: items || ord.items || [],
						taxes: taxes || ord.taxes || [],
						discounts: discounts || ord.discounts || [],
					});

					newOrd = {
						...newOrd,
						items,
						taxes,
						discounts,
						status: "awaiting_customer_confirmation",
						...calcs,
					};
				}
			}

			if (type === "accept") {
				newOrd = { status: "accepted" };
			}
			if (type === "packed") {
				newOrd = { status: "packed" };
			}
			if (type === "out_for_delivery") {
				newOrd = { status: "out_for_delivery" };
			}

			if (type === "replaced") {
				newOrd = { status: "replaced" };
			}
			if (type === "refunded") {
				newOrd = { status: "refunded" };
			}

			if (type === "delivered") {
				if (
					ord.confirmationOtp &&
					"otp" in data &&
					data.otp !== ord.confirmationOtp
				) {
					throw new HTTPError(400, { message: "Invalid OTP!" });
				}

				newOrd = { status: "delivered" };
			}

			if (type === "cancel") {
				if ("reason" in data) {
					newOrd = {
						status: "canceled",
						canceledAt: new Date(),
						cancelReason: data.reason,
					};
				}
			}

			if (
				Object.keys(newOrd).length !== 0 &&
				Object.values(newOrd).every((v) => v !== undefined)
			) {
				await db
					.updateTable("orders")
					.where("id", "=", id)
					.set({
						...newOrd,
						timeline: [
							...ord.timeline,
							{
								content: "Order updated",
								status: newOrd.status || ord.status!,
								userId: user?.id!,
								createdAt: new Date().toISOString(),
							},
						],
					})
					.execute();
			}

			return c.json(newOrd);
		},
	);
