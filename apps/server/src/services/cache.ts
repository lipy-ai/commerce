import { type ErrCode, HTTPError } from "@/lib/exception";
import { Redis } from "ioredis";
import env from "../env";

export const redis = new Redis(env?.REDIS_URL!);

type CacheMissFn<T> = () => Promise<T>;

export const getOrCache = async <T>({
	key,
	cacheMissFn,
	errorName,
	errorCode,
}: {
	key: string;
	cacheMissFn: CacheMissFn<T>;
	errorName: string;
	errorCode?: ErrCode;
}) => {
	const cache = await redis.get(key);
	const getFromDB = async () => {
		const result = await cacheMissFn();
		result && (await redis.set(key, JSON.stringify(result), "EX", 60 * 15));
		return result;
	};

	const result = cache
		? (JSON.parse(cache) as Awaited<ReturnType<typeof getFromDB>>)
		: await getFromDB();

	if (!result) {
		throw new HTTPError(404, {
			code: errorCode || undefined,
			message: errorName,
		});
	}
	return result;
};

export const delCache = async (key: string) => {
	await redis.del(key);
};
