import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import { getPresignedUrl } from "@/services/s3";
import { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const presignedSchema = z.object({
  contentLength: z.number().min(0),
  contentType: z.string(),
  filename: z.string(),
  type: z.enum(["avatar", "image"]),
});

const route = new Hono<ServerContext>().post(
  "/presigned",
  zValidator("json", presignedSchema),
  async (c) => {
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

    const id = crypto.randomUUID();

    const key = `${folder}/${id}.${filename.split(".").pop()}`;

    const presigned = await getPresignedUrl({
      contentLength,
      contentType,
      key,
    });
    const url = new URL(presigned);

    const image = await db
      .insertInto("upload")
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

    return c.json({ presigned_url: url, ...image });
  }
);

export { route as uploadRouter };
