import { type Selectable, SelectType, sql } from "kysely";

import { getOrCache, redisKeys } from ".";
import { type Database, db } from "@/db";
import type { AwaitedReturn } from "@/types";

export const getCachedOrgUser = async (
	store: Database["store"]["id"]["__select__"],
	user: Database["user"]["id"]["__select__"],
) =>
	getOrCache({
		key: redisKeys.storeUser.single(store, user),
		cacheMissFn: async () =>
			await db
				.selectFrom("storeMember as m")
				.leftJoin("user as u", "u.id", "m.userId")
				.selectAll(["u"])
				.select([
					sql<Selectable<Database["storeMember"]>>`to_jsonb(m)`.as("member"),
				])
				.where("u.id", "=", user)
				.where("m.storeId", "=", store)
				.executeTakeFirst(),
		errorName: "User not found!",
	});

export type CachedstoreUser = AwaitedReturn<typeof getCachedOrgUser>;
