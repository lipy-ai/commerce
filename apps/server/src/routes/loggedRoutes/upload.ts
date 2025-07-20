import { type DBTypes, db } from "@/db";
import { HTTPError } from "@/lib/exception";
import { zValidator } from "@/middlewares/validator";
import { getPresignedUrl, s3DeleteFile } from "@/services/s3";
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const presignedSchema = z.object({
	contentLength: z.number().min(0),
	contentType: z.string(),
	filename: z.string(),
});

function extractIdFromUrl(url: string): string | null {
	const path = new URL(url).pathname; // "/uploads/1234-uuid.png"
	const match = path.match(/\/uploads\/([^.\/]+)\./);
	return match ? match[1] : null;
}

const route = new Hono<ServerContext>()
	.post("/presigned", zValidator("json", presignedSchema), async (c) => {
		const { contentLength, contentType, filename } = c.req.valid("json");

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
			createdAt: new Date(),
		} satisfies Partial<DBTypes["upload"]>;

		await db.insertInto("upload").values(values).executeTakeFirstOrThrow();

		return c.json({ ...values, presigned_url: url.toString() });
	})
	.delete("/", zValidator("json", z.object({ url: z.string() })), async (c) => {
		const { url } = c.req.valid("json");

		const id = extractIdFromUrl(url);
		if (!id) throw new HTTPError(400, { message: "Invalid id!" });

		await db.transaction().execute(async (trx) => {
			const obj = await trx
				.deleteFrom("upload")
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirst();

			if (!obj) return;
			if (!obj.path) {
				throw new HTTPError(404, { message: "Key not found!" });
			}
			await s3DeleteFile({ key: obj.path });
		});

		return c.json({ success: true });
	});

export { route as uploadRoute };
