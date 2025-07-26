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
	setCookie(c, sessData, "", {
		path: "/",
		maxAge: 0,
		expires: new Date(0),
		sameSite: "None",
		...(env.IN_PROD && {
			secure: true,
			httpOnly: true,
			domain: `.${env.BETTER_AUTH_URL.split(".").slice(1).join(".")}`,
		}),
	});

	return true;
};
