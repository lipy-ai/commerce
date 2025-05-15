import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import { ServerContext } from "@/types";
import { Hono } from "hono";
import { sql } from "kysely";
import { z } from "zod";

const route = new Hono<ServerContext>();
const listZodSchema = z.object({
  limit: z.coerce.number().max(50),
  page: z.coerce
    .number()
    .min(1)
    .transform((t) => t - 1),
});

const listZodValidator = zValidator("query", listZodSchema);

route.get("/", listZodValidator, async (c) => {
  const { limit, page } = c.req.valid("query");
  const organizationId = c.var.session?.activeOrganizationId!;
  const offset = limit * page;

  const countPromise = db
    .selectFrom("shop.product")
    .where("organization_id", "=", organizationId)
    .select(sql<number>`count(*)`.as("total_count"))
    .executeTakeFirst();

  const resultsPromise = db
    .selectFrom("shop.product")
    .selectAll()
    .where("organization_id", "=", organizationId)
    .limit(limit)
    .offset(offset)
    .execute();

  const [countResult, items] = await Promise.all([
    countPromise,
    resultsPromise,
  ]);

  const totalCount = countResult?.total_count ?? 0;

  const totalPages = Math.ceil(totalCount / limit);

  return c.json({ items, page, limit, totalPages });
});

route.get(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const organizationId = c.var.session?.activeOrganizationId!;

    const result = await db
      .selectFrom("shop.product")
      .where("id", "=", id)
      .where("organization_id", "=", organizationId)
      .executeTakeFirstOrThrow();
    return c.json(result);
  }
);

route.post(
  "/",
  zValidator(
    "json",
    z.object({
      products: z.array(z.object({})),
    })
  ),
  async (c) => {
    const { products } = c.req.valid("json");
    const organizationId = c.var.session?.activeOrganizationId!;

    const result = await db
      .insertInto("shop.product")
      .values([])
      .executeTakeFirstOrThrow();
    return c.json(result);
  }
);

route.patch(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const organizationId = c.var.session?.activeOrganizationId!;
    const result = await db
      .updateTable("shop.product")
      .where("id", "=", id)
      .where("organization_id", "=", organizationId)
      .set({})
      .executeTakeFirstOrThrow();
    return c.json(result);
  }
);

route.delete(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const organizationId = c.var.session?.activeOrganizationId!;

    const result = await db
      .deleteFrom("shop.product")
      .where("id", "=", id)
      .where("organization_id", "=", organizationId)
      .executeTakeFirstOrThrow();
    return c.json(result);
  }
);

export { route as categoryRouter };
