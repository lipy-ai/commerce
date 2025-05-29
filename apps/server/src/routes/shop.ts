import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const cartSchema = z.object({
    variantId: z.number(),
    quantity: z.number().min(0).int(),
});

const route = new Hono<ServerContext>()
/**
 * Gets All Shops
 */
    .get("/", async (c) => {
        const session = c.get("session");

        const d = await db.selectFrom("store").selectAll().execute()

        return c.json( d || []);
    })

export { route as shopRoute };
