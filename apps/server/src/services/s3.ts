import env from "@/env";
import { HTTPError } from "@/lib/exception";
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
	region: env.AWS_S3_REGION,

	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY,
		secretAccessKey: env.AWS_SECRET_KEY,
	},
	signingRegion: env.AWS_S3_REGION,
});

export async function getPresignedUrl({
	key,
	contentType,
	contentLength,
}: {
	contentLength: number;
	contentType: string;
	key: string;
}) {
	const url = await getSignedUrl(
		s3Client,
		new PutObjectCommand({
			Bucket: env.AWS_S3_BUCKET,
			Key: key,
			ContentType: contentType,
			ContentLength: contentLength,
		}),
		{ expiresIn: 3600 },
	).catch((e) => {
		throw new HTTPError(404, { message: "Failed to delete file!", cause: e });
	});

	return url;
}

export async function s3DeleteFile({ key }: { key: string }) {
	const cmd = new DeleteObjectCommand({
		Bucket: env.AWS_S3_BUCKET,
		Key: key,
	});

	return await s3Client.send(cmd).catch((e) => {
		throw new HTTPError(400, { message: "Failed to delete file!", cause: e });
	});
}
