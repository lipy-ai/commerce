import { json } from "better-auth";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { title } from "process";
import { db } from "@/db";
import { delCache, getOrCache } from "@/services/cache";

const key = "store:";

export const storeCacheKey = (storeId: string, userId?: string) =>
	`${key}${storeId}${userId ? `:member:${userId}` : ""}`;

export const getStore = async (storeId: string) => {
	return await getOrCache({
		key: storeCacheKey(storeId),
		cacheMissFn: async () => {
			const store = await db
				.selectFrom("store as s")
				.where("s.id", "=", storeId)
				.selectAll("s")
				.executeTakeFirst();

			if (!store) return null;

			const coupons = await db
				.selectFrom("coupons as c")
				.where("c.storeId", "=", storeId)
				.where("c.status", "=", "active")
				.selectAll("c")
				.execute();

			return {
				...store,
				coupons,
			};
		},
		errorName: "Store not found!",
	});
};

export const delStore = async (storeId: string) => {
	await delCache(`store:${storeId}*`);
};

export const getStoreMember = async (storeId: string, userId: string) => {
	return await getOrCache({
		key: storeCacheKey(storeId),
		cacheMissFn: async () =>
			await db
				.selectFrom("storeMember as s")
				.where("s.storeId", "=", storeId)
				.where("s.userId", "=", userId)
				.selectAll()
				.executeTakeFirst(),
		errorName: "Store member not found!",
	});
};

export const delStoreMember = async (storeId: string, userId: string) => {
	await delCache(storeCacheKey(storeId, userId));
};
