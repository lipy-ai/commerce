import { Hono } from "hono";

import { showRoutes } from "hono/dev";
import { logger as httpLogger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { compress } from "hono/compress";

import { logger } from "./lib/logger";

import env from "./env";
import { db, pingDatabase } from "./db";
import { auth } from "./auth";
import { categoryRouter } from "./adminRoutes";
import { ServerContext } from "./types";
import { authMiddleware } from "./middlewares/auth";
import { corsMiddleware } from "./middlewares/cors";

export const app = new Hono<ServerContext>();

// Generic middlewares
app.use("*", corsMiddleware);
// app.use(tracing);
app.use(httpLogger());
app.use(trimTrailingSlash());

if (env.NODE_ENV === "development") {
  logger.info("Available routes:");
  showRoutes(app);
}

await pingDatabase();

app.use("*", authMiddleware);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.use(compress());

const routes = app.basePath("/v1");

routes.basePath("/admin").route("/category", categoryRouter);

const shutdown = async () => {
  logger.info("Closing http server");
  await db.destroy();
  logger.info("DB connection closed");
  process.exit();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export type AppType = typeof app;
