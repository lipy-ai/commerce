import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const cartSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.string(),
      quantity: z.number().int(),
    })
  ),
});

const route = new Hono<ServerContext>()
  .get("/", async (c) => {
    const session = c.get("session");
    let data = await db
      .selectFrom("cart")
      .selectAll()
      .where("user_id", "=", session?.userId!)
      .executeTakeFirst();
    if (!data) {
      data = await db
        .insertInto("cart")
        .values({
          user_id: session?.userId!,
          items: [],
        })
        .returningAll()
        .executeTakeFirst();
    }
    return c.json(data?.items || []);
  })

  .patch("/", zValidator("json", cartSchema), async (c) => {
    const session = c.get("session");
    const values = c.req.valid("json");
    console.log(session?.userId);
    await db
      .updateTable("cart")
      .where("user_id", "=", session?.userId!)
      .set({
        items: values.items,
      })
      .executeTakeFirstOrThrow();
    return c.json({ success: true });
  });

export { route as cartRoute };
