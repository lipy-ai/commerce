import { Database, type DBTypes } from "@/db";
import env from "../env";
import { HTTPException } from "hono/http-exception";
import { Redis } from "ioredis";

export const redis = new Redis(env?.REDIS_URL!);

export const redisKeys = {
	store: {
		single: (val: DBTypes["store"]["id"]) => `store:${val}`,
	},
	storeUser: {
		single: (storeId: DBTypes["store"]["id"], userId: DBTypes["user"]["id"]) =>
			`storeUser:${storeId}:${userId}`,
	},
};

type CacheMissFn<T> = () => Promise<T>;

export const getOrCache = async <T>({
	key,
	cacheMissFn,
	errorName,
}: {
	key: string;
	cacheMissFn: CacheMissFn<T>;
	errorName: string;
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
		throw new HTTPException(404, {
			message: errorName,
		});
	}
	return result;
};

export const delCache = async (key: string) => {
	await redis.del(key);
};
