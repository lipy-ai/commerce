import { Hono } from "hono";
import z from "zod";
import { db } from "@/db";
import { HTTPError } from "@/lib/exception";
import { zValidator } from "@/middlewares/validator";
import type { ServerContext } from "@/types";
import { logger } from "@/lib/logger";

const deviceSchema = z.object({
  id: z.string().uuid().optional(),
  pushToken: z.string(),
  platform: z.string() as any,
});

export const loggedInSessionRoute = new Hono<ServerContext>()
  .get(
    "/invitation/:id",
    zValidator("param", z.object({ id: z.string().uuid() })),
    async (c) => {
      const { id } = c.req.valid("param");

      const inv = await db
        .selectFrom("storeInvitation as si")
        .where("si.id", "=", id)
        .leftJoin("store as s", "s.id", "si.storeId")
        .selectAll(["si"])
        .select(["s.image as storeImage", "s.name as storeName"])
        .executeTakeFirst();

      if (!inv) {
        throw new HTTPError(404, { message: "No invitation found!" });
      }
      return c.json(inv);
    }
  )
  .post("/device", zValidator("json", deviceSchema), async (c) => {
    const sess = c.get("session");
    const { pushToken, platform, ...rest } = c.req.valid("json");

    let id = rest.id;

    if (!id) {
      id = crypto.randomUUID();
    }

    await db
      .insertInto("devices")
      .values({
        id,
        userId: sess?.userId!,
        platform,
        pushToken,
        lastSeenAt: new Date(),
      })
      .onConflict((eb) =>
        eb.column("id").doUpdateSet({
          pushToken,
          lastSeenAt: new Date(),
        })
      )
      .execute();

    return c.json({ id });
  })
  .delete(
    "/device",
    zValidator("json", z.object({ ids: z.string().uuid().array().min(1) })),
    async (c) => {
      const sess = c.get("session");
      const { ids } = c.req.valid("json");
      await db
        .deleteFrom("devices")
        .where("id", "in", ids)
        .where("userId", "=", sess?.userId!)
        .execute();
      return c.json({ success: true });
    }
  );
