import { Env, Hono } from "hono";

import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger as httpLogger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";

import { logger } from "./lib/logger";

import env from "./env";
import { db, pingDatabase } from "./db";
import { auth } from "./auth";
import { userRouter } from "./routes";
import { Context } from "./types";
import { compress } from "hono/compress";

export const app = new Hono<Context>();

// Generic middlewares
app.use(
  "*",
  cors({
    origin: env.TRUSTED_ORIGINS, // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
// app.use(tracing);
app.use(httpLogger());
app.use(trimTrailingSlash());

if (env.NODE_ENV === "development") {
  logger.info("Available routes:");
  showRoutes(app);
}

await pingDatabase();

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// app.use(compress());

const routes = app.basePath("/v1");

routes.route("/user", userRouter);

const shutdown = async () => {
  logger.info("Closing http server");
  await db.destroy();
  logger.info("DB connection closed");
  process.exit();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export type AppType = typeof app;
