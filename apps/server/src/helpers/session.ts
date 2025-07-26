import { auth } from "@/auth";
import env from "@/env";
import { redis } from "@/services/cache";
import type { ServerContext } from "@/types";
import type { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
export const updateSession = async (
	c: Context<ServerContext>,
	data: {
		session: ServerContext["Variables"]["session"];
		user: ServerContext["Variables"]["user"];
	},
) => {
	const sess = c.get("session");

	if (!sess?.token) throw Error("No token!");
	await redis.set(
		sess.token,
		JSON.stringify({
			session: data.session,
			user: data.user,
		}),
	);
	const sessData = (await auth.$context).authCookies.sessionData.name;
	deleteCookie(c, sessData, {
		...(env.IN_PROD && {
			secure: true,
			domain: `.${env.BETTER_AUTH_URL.split(".").slice(1).join(".")}`,
		}),
	});

	return true;
};
