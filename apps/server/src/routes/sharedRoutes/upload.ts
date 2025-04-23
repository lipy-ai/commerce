import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import { getPresignedUrl } from "@/services/s3";
import { ServerContext } from "@/types";
import { randomUUIDv7 } from "bun";
import { Hono } from "hono";
import { z } from "zod";

const route = new Hono<ServerContext>();

const presignedSchema = z.object({
  contentLength: z.number().min(0),
  contentType: z.string(),
  filename: z.string(),
  type: z.enum(["avatar", "image"]),
});

route.post("/presigned", zValidator("json", presignedSchema), async (c) => {
  const { contentLength, contentType, filename, type } = c.req.valid("json");

  const organization_id = c.var.session?.activeOrganizationId!;
  const user_id = c.var.session?.userId!;

  let folder = null;

  switch (type) {
    case "image":
      folder = "images";
      break;
    case "avatar":
      folder = "avatars";
    default:
      folder = "images";
      break;
  }

  const id = randomUUIDv7();

  const key = `${folder}/${id}.${filename.split(".").pop()}`;

  const presigned = await getPresignedUrl({
    contentLength,
    contentType,
    key,
  });
  const url = new URL(presigned);

  const image = await db
    .insertInto("public.upload")
    .values({
      id,
      content_type: contentType,
      content_length: contentLength,
      name: filename,
      path: key,
      url: `https://${url.host}/${key}`,
      uploaded_by: user_id,
      organization_id,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning(["id", "content_length", "content_type", "url", "path"])
    .executeTakeFirstOrThrow();

  return c.json({ presigned: url, ...image });
});
