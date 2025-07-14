import { redis } from "@/services/cache";
import type { ServerContext } from "@/types";

export const updateSession = async (
	token: string,
	data: {
		session: ServerContext["Variables"]["session"];
		user: ServerContext["Variables"]["user"];
	},
) => {
	return await redis.set(
		token,
		JSON.stringify({
			session: data.session,
			user: data.user,
		}),
	);
};
