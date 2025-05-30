import { db, type DBTypes } from "@/db";
import { zValidator } from "@/middlewares/validator";
import { getPresignedUrl } from "@/services/s3";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const presignedSchema = z.object({
	contentLength: z.number().min(0),
	contentType: z.string(),
	filename: z.string(),
});

const route = new Hono<ServerContext>().post(
	"/presigned",
	zValidator("json", presignedSchema),
	async (c) => {
		const { contentLength, contentType, filename } = c.req.valid("json");
		const activeStoreId = c.var.session?.activeStoreId!;
		const userId = c.var.session?.userId!;

		const id = crypto.randomUUID();

		const key = `uploads/${id}.${filename.split(".").pop()}`;
		const presigned = await getPresignedUrl({
			contentLength: contentLength,
			contentType: contentType,
			key,
		});

		const url = new URL(presigned);

		const values = {
			id,
			contentType: contentType,
			contentLength: contentLength,
			name: filename,
			path: key,
			url: `https://${url.host}/${key}`,
			uploadedBy: userId,
			storeId: activeStoreId || null,
			presigned_url: url.toString() ,
			createdAt: new Date(),
			updatedAt: new Date(),
		} satisfies Partial<DBTypes['upload']> & {presigned_url:string};

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
