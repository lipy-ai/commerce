import env from "@/env";
import {
	GetObjectCommand,
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
	);

	return url;
}

export async function getFileUrl({ key }: { key: string }) {
	const url = await getSignedUrl(
		s3Client,
		new GetObjectCommand({
			Bucket: env.AWS_S3_BUCKET,
			Key: key,
		}),
		{ expiresIn: 3600 },
	);

	return url;
}

export async function getDownloadUrl(objectName: string) {
	return getSignedUrl(
		s3Client,
		new GetObjectCommand({
			Bucket: env.AWS_S3_BUCKET,
			Key: objectName,
		}),
		{ expiresIn: 3600 },
	);
}
