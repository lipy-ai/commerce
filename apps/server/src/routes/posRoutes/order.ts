import { type DBTypes, db } from "@/db";
import { ORDER_STATUS } from "@/db/schema";
import { HTTPError } from "@/lib/exception";
import { idGenerate } from "@/lib/generateId";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import type { Updateable } from "kysely";
import { z } from "zod";

const orderSchema = z.object({
	items: z
		.array(
			z.object({
				inventoryId: z.string().uuid().optional(),
				variantId: z.string().optional(),
				productId: z.string().uuid().optional(),
				title: z.string(),
				thumbnail: z.string(),
				unit: z.string(),
				qty: z.coerce.number().min(1),
				price: z.coerce.number().min(0),
				maxPrice: z.coerce.number().min(0),
			}),
		)
		.min(1),
	taxes: z.array(
		z.object({ id: z.string(), name: z.string(), amount: z.number() }),
	),
	discounts: z.array(
		z.object({ id: z.string(), name: z.string(), amount: z.number() }),
	),
	status: z.enum(ORDER_STATUS),
});

export function orderCalculator({
	items,
	discounts,
	taxes,
}: {
	items: Array<{ price: number; maxPrice?: number; qty: number }>;
	discounts: Array<{ amount: number }>;
	taxes: Array<{ amount: number }>;
}) {
	const itemsTotal = items.reduce(
		(sum, item) => sum + item.price * item.qty,
		0,
	);
	const maxItemsTotal = items.reduce(
		(sum, item) => sum + (item.maxPrice ?? item.price) * item.qty,
		0,
	);

	const discountTotal = discounts.reduce((sum, d) => sum + d.amount, 0);
	const taxTotal = taxes.reduce((sum, t) => sum + t.amount, 0);

	const totalAmount = itemsTotal + taxTotal - discountTotal;
	const maxTotalAmount = maxItemsTotal + taxTotal - discountTotal;

	return {
		itemTotalAmount: itemsTotal,
		maxItemTotalAmount: maxItemsTotal,
		totalDiscountAmount: discountTotal,
		totalTaxAmount: taxTotal,
		totalAmount,
		amountSaved: maxTotalAmount - totalAmount,
	};
}

export const posOrderRoute = new Hono<ServerContext>()
	.post("/", zValidator("json", orderSchema), async (c) => {
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

			return c.json({ data });
		},
	)
	.patch(
		"/:id",
		zValidator("json", orderSchema.partial()),
		zValidator("param", z.object({ id: z.string() })),
		async (c) => {
			const { id } = c.req.valid("param");
			const user = c.get("user");
			const { items, taxes, discounts, status } = c.req.valid("json");

			const ord = await db
				.selectFrom("orders")
				.where("id", "=", id)
				.selectAll()
				.executeTakeFirstOrThrow()
				.catch(() => {
					throw new HTTPError(404, { message: "Order not found!" });
				});

			let newOrd: Updateable<DBTypes["orders"]> = { status };

			if (["refunded", "delivered"].includes(ord.status!)) {
				throw new HTTPError(400, { message: "Order completed!" });
			}

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
								content: `Order updated to status - (${newOrd.status?.replaceAll("_", " ")})`,
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
