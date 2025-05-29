import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const cartSchema = z.object({
    variant_id: z.number(),
    quantity: z.number().min(0).int(),
});

const route = new Hono<ServerContext>()
    .get("/", async (c) => {
        const session = c.get("session");
        
        return c.json( []);
    })
    .patch("/", zValidator("json", cartSchema), async (c) => {
        const session = c.get("session");
        const values = c.req.valid("json");


        return c.json({ success: true });
    });

export { route as cartRoute };
