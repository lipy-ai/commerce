import type { MiddlewareHandler } from "hono";
import { auth } from "@/auth";
import env from "@/env";
import { ERR_CODES, HTTPError } from "@/lib/exception";
import type { ServerContext } from "@/types";

export const authMiddleware: MiddlewareHandler<ServerContext> = async (
	c,
	next,
) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}
	c.set("user", session.user as ServerContext["Variables"]["user"]);

	c.set("session", session.session as ServerContext["Variables"]["session"]);
	return next();
};

export const isLoggedIn: MiddlewareHandler<ServerContext> = async (c, next) => {
	const sess = c.get("session");
	if (!sess?.userId) {
		throw new HTTPError(401, {
			code: ERR_CODES.NOT_LOGGED_IN,
		});
	}
	return next();
};

export const isSuperAdmin: MiddlewareHandler<ServerContext> = async (
	c,
	next,
) => {
	const sess = c.get("session");
	const user = c.get("user");

	if (!sess?.userId) {
		throw new HTTPError(401, {
			code: ERR_CODES.NOT_LOGGED_IN,
		});
	}

	if (!env.SUPER_ADMINS.includes(user?.email || "")) {
		throw new HTTPError(401, {
			code: ERR_CODES.INSUFFICIENT_PERMISSION,
		});
	}
	return next();
};

export const STORE_ROLES = [
	"owner",
	"admin",
	"staff",
	"delivery_agent",
] as const;

export const hasStorePermission =
	(
		roles: Array<(typeof STORE_ROLES)[keyof typeof STORE_ROLES]>,
	): MiddlewareHandler<ServerContext> =>
	async (c, next) => {
		const sess = c.get("session");

		if (!sess?.userId) {
			throw new HTTPError(401, {
				code: ERR_CODES.NOT_LOGGED_IN,
			});
		}

		if (!sess?.activeStoreId)
			throw new HTTPError(401, {
				code: ERR_CODES.NO_ACTIVE_STORE,
			});

		if (!sess?.activeStoreRole || !roles.includes(sess?.activeStoreRole as any))
			throw new HTTPError(401, {
				code: ERR_CODES.INSUFFICIENT_PERMISSION,
				cause: `Required roles - ${roles.join(",")}`,
			});

		return next();
	};
