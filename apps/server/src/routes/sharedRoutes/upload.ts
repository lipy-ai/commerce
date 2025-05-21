import { db } from "@/db";
import { zValidator } from "@/middlewares/validator";
import { getPresignedUrl } from "@/services/s3";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const presignedSchema = z.object({
	contentLength: z.number().min(0),
	contentType: z.string(),
	filename: z.string(),
	type: z.enum(["image", "product"]),
});

const route = new Hono<ServerContext>().post(
	"/presigned",
	zValidator("json", presignedSchema),
	async (c) => {
		const { contentLength, contentType, filename, type } = c.req.valid("json");
		const organization_id = c.var.session?.activeOrganizationId!;
		const user_id = c.var.session?.userId!;

		let folder: string;

		switch (type) {
			case "image":
				folder = "images";
				break;
			case "product":
				folder = "product";
				break;
			default:
				folder = "images";
				break;
		}

		const id = crypto.randomUUID();

		const key = `uploads/${folder}/${id}.${filename.split(".").pop()}`;
		const presigned = await getPresignedUrl({
			contentLength: contentLength,
			contentType: contentType,
			key,
		});

		const url = new URL(presigned);

		const values = {
			id,
			content_type: contentType,
			content_length: contentLength,
			name: filename,
			path: key,
			url: `https://${url.host}/${key}`,
			uploaded_by: user_id,
			organization_id,
			presigned_url: url.toString(),
			created_at: new Date(),
			updated_at: new Date(),
		};

		const image = await db
			.insertInto("upload")
			.values(values)
			.returning(["id"])
			.executeTakeFirstOrThrow();

		return c.json({
			id: image.id,
			presigned_url: values.presigned_url,
			path: values.path,
		});
	},
);

export { route as uploadRouter };
