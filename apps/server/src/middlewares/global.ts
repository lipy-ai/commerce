import env from "@/env";
import { logger } from "@/lib/logger";
import { ServerContext } from "@/types";
import { type MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const globalMiddleware: MiddlewareHandler<ServerContext> = async (
  c,
  next
) => {
  const validKey = c.req.header("M2M-Key") === env.VITE_M2M_KEY.toString();
  // if (!validKey) {
  //   logger.warn("Blocked an due to missing M2M key...");
  //   throw new HTTPException(401, {
  //     message: "Unauthorized!",
  //   });
  // }

  return next();
};
