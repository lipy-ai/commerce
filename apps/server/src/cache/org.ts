import { type Selectable, SelectType, sql } from "kysely";

import { getOrCache, redisKeys } from ".";
import { type Database, db } from "@/db";
import type { AwaitedReturn } from "@/types";

export const getCachedOrgUser = async (
	org: Database["org.list"]["id"]["__select__"],
	user: Database["auth.user"]["id"]["__select__"],
) =>
	getOrCache({
		key: redisKeys.orgUser.single(org, user),
		cacheMissFn: async () =>
			await db
				.selectFrom("org.member as m")
				.leftJoin("auth.user as u", "u.id", "m.user_id")
				.selectAll(["u"])
				.select([
					sql<Selectable<Database["org.member"]>>`to_jsonb(m)`.as("member"),
				])
				.where("u.id", "=", user)
				.where("m.organization_id", "=", org)
				.executeTakeFirst(),
		errorName: "User not found!",
	});

export type CachedOrgUser = AwaitedReturn<typeof getCachedOrgUser>;
