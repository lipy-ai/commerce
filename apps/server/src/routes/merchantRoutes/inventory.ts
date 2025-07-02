import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

export const merchantInventoryRoute = new Hono<ServerContext>().patch(
	"/",
	zValidator(
		"json",
		z.object({
			id: z.string().optional(),
			variantId: z.string().uuid(),
			price: z.coerce.number().min(1).optional(),
			stock: z.coerce.number().min(-1).optional(),
			sku: z.string().optional(),
			active: z.boolean(),
		}),
	),
	async (c) => {
		try {
			const { id, variantId, price, stock, sku, active } = c.req.valid("json");

			const sess = c.get("session");

			if (!id) {
				await db
					.insertInto("storeInventory")
					.values({
						id: crypto.randomUUID(),
						productVariant: variantId,
						price,
						stock,
						sku,
						storeId: sess?.activeStoreId!,
					})
					.execute();
			} else {
				if (!active) {
					await db
						.deleteFrom("storeInventory")
						.where("id", "=", id)
						.where("storeId", "=", sess?.activeStoreId!)
						.execute();
				} else {
					await db
						.updateTable("storeInventory")
						.set({
							productVariant: variantId,
							price,
							stock,
							sku,
						})
						.where("id", "=", id)
						.where("storeId", "=", sess?.activeStoreId!)
						.execute();
				}
			}

			return c.json({ success: true });
		} catch (err) {
			console.error("ERROR:", err);
			throw err;
		}
	},
);
