import { db } from "@/db";
import { ORDER_STATUS } from "@/db/schema";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const paramSchema = z.object({
	id: z.string().uuid(),
});

const orderSchema = z.object({
	items: z.array(z.object({})),
	taxes: z.object({}),
	address: z.object({}),
	delivery: z.object({}),
	payment: z.object({}),
	storeId: z.string().uuid(),
	status: z.enum(ORDER_STATUS),
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");
		const data = await db
			.selectFrom("orders as o")
			.where("o.userId", "=", session?.userId!)
			.select(["o.id", "o.total", "o.status"])
			.execute();

		return c.json(data || []);
	})
	.get("/:id", zValidator("param", paramSchema), async (c) => {
		const session = c.get("session");
		const { id } = c.req.valid("param");
		const data = await db
			.selectFrom("orders as o")
			.where("o.userId", "=", session?.userId!)
			.where("o.id", "=", id)
			.select(["o.id", "o.total", "o.status"])
			.execute();

		return c.json(data || []);
	})
	.post("/", zValidator("json", orderSchema), async (c) => {
		const session = c.get("session");
		const values = c.req.valid("json");
		await db
			.insertInto("orders")
			.values({ id: crypto.randomUUID(), userId: session?.userId!, ...values })
			.execute();

		return c.json({ success: true });
	})
	.post("/cancel/:id", zValidator("param", paramSchema), async (c) => {
		const session = c.get("session");
		const { id } = c.req.valid("param");

		await db
			.updateTable("orders")
			.where("id", "=", id)
			.where("userId", "=", session?.userId!)
			.set({ status: "cancelled" })
			.execute();
		return c.json({ success: true });
	});

export { route as productRoute };
