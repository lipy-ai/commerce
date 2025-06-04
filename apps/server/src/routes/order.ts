import { type DBTypes, db } from "@/db";
import { idGenerate } from "@/lib/generateId";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Expression, SqlBool } from "kysely";
import { z } from "zod";

const paramSchema = z.object({
	id: z.string(),
});

const orderSchema = z.object({
	address: z.string(),
	deliveryInstruction: z.string().nullable(),
	storeInstruction: z
		.array(z.object({ id: z.string().uuid(), instruction: z.string() }))
		.nullable(),
	coupon: z.string().optional(),
});

const querySchema = z.object({
	view: z.enum(["active", "all"]).default("all"),
});
const route = new Hono<ServerContext>()
	.get("/", zValidator("query", querySchema), async (c) => {
		const session = c.get("session");
		const q = c.req.valid("query");
		const data = await db
			.selectFrom("orders as o")
			.where("o.orderedBy", "=", session?.userId!)
			.$if(q.view === "active", (qb) =>
				qb.where((eb) =>
					eb.or([
						eb("o.status", "in", [
							"ordered",
							"accepted",
							"out_for_delivery",
							"packed",
							"return_requested",
						]),
					]),
				),
			)
			.leftJoin("store as s", "s.id", "o.storeId")
			.select([
				"o.id",
				"o.itemTotalAmount",
				"o.status",
				"o.items",
				"o.pk as orderPrimaryId",
				"o.orderedAt",
				"s.name as storeName",
				"s.logo as storeLogo",
				"s.id as storeId",
			])
			.orderBy("o.orderedAt", "desc")
			.execute();

		return c.json(data || []);
	})
	.get("/:id", zValidator("param", paramSchema), async (c) => {
		const session = c.get("session");
		const { id } = c.req.valid("param");

		const data = await db
			.selectFrom("orders as o")
			.where("o.orderedBy", "=", session?.userId!)
			.where("o.pk", "=", id)
			.selectAll()
			.execute();

		return c.json(data || []);
	})
	.post("/", zValidator("json", orderSchema), async (c) => {
		const session = c.get("session");
		const values = c.req.valid("json");

		const address = await db
			.selectFrom("address")
			.where("address.id", "=", values.address)
			.where("address.userId", "=", session?.userId!)
			.selectAll()
			.executeTakeFirst();

		if (!address)
			throw new HTTPException(404, { message: "Address not found!" });

		const cart = await db
			.selectFrom("cart")
			.where("cart.userId", "=", session?.userId!)
			.leftJoin("productVariant as pv", "pv.id", "cart.variantId")
			.leftJoin("product as p", "p.id", "pv.product")
			.select((eb) => [
				eb.fn.toJson("cart").as("cart"),
				eb.fn.toJson("p").as("product"),
				eb.fn.toJson("pv").as("variant"),
			])
			.execute();

		const orders: DBTypes["orders"][] = [];

		for (const c of cart) {
			const item = {
				id: c.product.id!,
				title: c.product.title!,
				quantity: c.cart.quantity!,
				thumbnail: c.product.thumbnail!,
				variant: {
					id: c.variant.id!,
					title: c.variant.title!,
					maxPrice: c.variant.maxPrice!,
					price: c.variant.price!,
				},
			} satisfies NonNullable<DBTypes["orders"]["items"]>[0];

			const store = orders.find((s) => s?.storeId === c.variant.storeId);

			if (store) {
				store.items?.push(item);
			} else {
				orders.push({
					id: crypto.randomUUID(),
					pk: idGenerate({ prefix: "ORD" }),
					status: "ordered",
					address: address,
					items: [item],
					taxes: [],
					discounts: [],
					currency: "inr",
					storeId: c.variant.storeId!,
					orderedBy: session?.userId!,
					paymentMethod: "cod",
					orderedAt: new Date(),
					itemTotalAmount: 0,
					totalAmount: 0,
					amountSaved: 0,
					totalTaxAmount: 0,
					totalDiscountAmount: 0,
					maxItemTotalAmount: 0,
					delivery: null,
					deliveryInstruction: values.deliveryInstruction,
					storeInstructions:
						values.storeInstruction?.find((s) => s.id === c.variant.storeId)
							?.instruction || null,
					cancelledAt: null,
					refundedAt: null,
					deliveredAt: null,
					deliveryAgentAssignedAt: null,
				} satisfies NonNullable<DBTypes["orders"]>);
			}
		}

		for (let index = 0; index < orders.length; index++) {
			const el = orders[index];

			let itemTotalAmount = 0;
			let maxItemTotalAmount = 0;
			let totalTaxAmount = 0;
			let totalDiscountAmount = 0;

			if (!el?.items) return;
			for (const t of el.items) {
				itemTotalAmount = t.quantity * t.variant.price + itemTotalAmount;
				maxItemTotalAmount =
					t.quantity * t.variant.maxPrice + maxItemTotalAmount;
			}
			for (const t of el.taxes || []) {
				totalTaxAmount = totalTaxAmount + t.amount;
				itemTotalAmount = itemTotalAmount + t.amount;
				maxItemTotalAmount = maxItemTotalAmount + t.amount;
			}

			for (const t of el.discounts || []) {
				totalDiscountAmount = totalDiscountAmount + t.amount;
				itemTotalAmount = itemTotalAmount - t.amount;
				maxItemTotalAmount = maxItemTotalAmount - t.amount;
			}

			el.amountSaved = maxItemTotalAmount - itemTotalAmount;
			el.totalAmount = maxItemTotalAmount - itemTotalAmount;
			el.itemTotalAmount = itemTotalAmount;
			el.maxItemTotalAmount = maxItemTotalAmount;
			el.totalTaxAmount = totalTaxAmount;
			el.totalDiscountAmount = totalDiscountAmount;
		}

		await db.insertInto("orders").values(orders).execute();

		return c.json({ orders: orders.map((o) => o.pk) });
	})
	.post("/cancel/:id", zValidator("param", paramSchema), async (c) => {
		const session = c.get("session");
		const { id } = c.req.valid("param");

		await db
			.updateTable("orders")
			.where("id", "=", id)
			.where("orderedBy", "=", session?.userId!)
			.set({ status: "cancelled" })
			.execute();
		return c.json({ success: true });
	});

export { route as orderRoute };
