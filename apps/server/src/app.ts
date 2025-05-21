import { Hono } from "hono";

import { showRoutes } from "hono/dev";
import { logger as httpLogger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { compress } from "hono/compress";

import { logger } from "./lib/logger";

import env from "./env";
import { db, pingDatabase } from "./db";
import { auth } from "./auth";
import type { ServerContext } from "./types";
import { authMiddleware } from "./middlewares/auth";
import { corsMiddleware } from "./middlewares/cors";
import { uploadRouter } from "./routes/sharedRoutes/upload";
import { globalError } from "./lib/globalError";
import { addressRoute } from "./routes/sharedRoutes/address";
import { secureHeaders } from "hono/secure-headers";
import { globalMiddleware } from "./middlewares/global";

export const app = new Hono<ServerContext>();

// Generic middlewares
app.use("*", corsMiddleware);

app.use(secureHeaders());
// app.use(tracing);
app.use(httpLogger());
app.use(trimTrailingSlash());
app.use("*", globalMiddleware);

if (env.NODE_ENV === "development") {
	logger.info("Available routes:");
	showRoutes(app);
}

await pingDatabase();
app.use("*", authMiddleware);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

// app.use(compress());

export const routes = app
	.basePath("/v1")
	.route("/upload", uploadRouter)
	.route("/address", addressRoute);

// routes.basePath("/admin").route("/category", categoryRouter);

app.onError(globalError);

const shutdown = async () => {
	logger.info("Closing http server");
	await db.destroy();
	logger.info("DB connection closed");
	process.exit();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export type AppType = typeof routes;
