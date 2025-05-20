import env from "@/env";
import { logger } from "@/lib/logger";
import { ServerContext } from "@/types";
import { type MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { isbot } from "isbot";
import { getConnInfo } from "hono/bun";

// const hosts = env.TRUSTED_ORIGINS.map((t) => new URL(t).host);

export const globalMiddleware: MiddlewareHandler<ServerContext> = async (
  c,
  next
) => {
  const userAgent = c.req.header("User-Agent");
  const bot = isbot();
  const info = getConnInfo(c); // info is `ConnInfo`

  if (userAgent === "node") {
    if (!env.TRUSTED_IPS?.includes(info.remote.address || "")) {
      logger.warn("Blocked an not trusted IP...");
      throw new HTTPException(401, {
        message: "Unauthorized!",
      });
    } else {
      return next();
    }
  }

  if (bot) {
    logger.warn("Blocked an due isBot lib...");
    throw new HTTPException(401, {
      message: "Unauthorized!",
    });
  }

  return next();
};
