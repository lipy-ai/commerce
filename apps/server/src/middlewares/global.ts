import env from "@/env";
import { logger } from "@/lib/logger";
import { ServerContext } from "@/types";
import { type MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { isbot } from "isbot";
const hosts = env.TRUSTED_ORIGINS.map((t) => new URL(t).host);

export const globalMiddleware: MiddlewareHandler<ServerContext> = async (
  c,
  next
) => {
  const bot = isbot(c.req.header("User-Agent"));
  if (bot) {
    const trustedHost = hosts.includes(
      (c.req.header("Referer") && new URL(c.req.header("Referer")!).host) || ""
    );
    if (!trustedHost) {
      logger.warn("Blocked an due isBot lib...");
      throw new HTTPException(401, {
        message: "Unauthorized!",
      });
    }
  }

  return next();
};
