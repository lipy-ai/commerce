import env from "@/env";
import { logger } from "@/lib/logger";
import { ServerContext } from "@/types";
import { type MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { isbot } from "isbot";

export const globalMiddleware: MiddlewareHandler<ServerContext> = async (
  c,
  next
) => {
  const userAgent = c.req.header("User-Agent");
  const isBot = isbot(userAgent);
  const validKey = c.req.header("M2M-Key") === env.VITE_M2M_KEY.toString();
  if ((isBot && validKey) || !validKey) {
    logger.warn("Blocked an due to missing headers / bot activity...");
    throw new HTTPException(401, {
      message: "Unauthorized!",
    });
  }

  return next();
};
