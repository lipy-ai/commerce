import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";

export const merchantInventoryRoute = new Hono<ServerContext>().patch(
	"/",
	zValidator(
		"json",
		z.object({
			id: z.string().uuid(),
			variantId: z.string().uuid(),
			price: z.coerce.number().min(1).optional(),
			inStock: z.boolean().optional(),
			sku: z.string().optional(),
			active: z.boolean().optional(),
			operation: z.enum(["create", "update", "delete"]),
		}),
	),
	async (c) => {
		try {
			const { id, variantId, price, inStock, sku, operation, active } =
				c.req.valid("json");

			const sess = c.get("session");

			if (operation === "create") {
				await db
					.insertInto("storeInventory")
					.values({
						id: crypto.randomUUID(),
						variantId,
						price,
						inStock,
						sku,
						active: true,
						storeId: sess?.activeStoreId!,
					})
					.execute();
			}

			if (operation === "update") {
				await db
					.updateTable("storeInventory")
					.set({
						variantId,
						price,
						inStock,
						sku,
						active,
					})
					.where("id", "=", id)
					.where("storeId", "=", sess?.activeStoreId!)
					.execute();
			}

			if (operation === "delete") {
				await db
					.deleteFrom("storeInventory")
					.where("id", "=", id)
					.where("storeId", "=", sess?.activeStoreId!)
					.execute();
			}

			return c.json({ success: true });
		} catch (err) {
			console.error("ERROR:", err);
			throw err;
		}
	},
);
