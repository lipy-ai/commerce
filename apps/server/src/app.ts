import { Hono } from "hono";

import { showRoutes } from "hono/dev";
import { logger as httpLogger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";

import { logger } from "./lib/logger";

import { secureHeaders } from "hono/secure-headers";
import { auth } from "./auth";
import { db, pingDatabase } from "./db";
import env from "./env";
import { globalError } from "./lib/globalError";
import { authMiddleware } from "./middlewares/auth";
import { corsMiddleware } from "./middlewares/cors";
import { globalMiddleware } from "./middlewares/global";
import { shopRoute } from "./routes/customer/shops";
import { addressRoute } from "./routes/sharedRoutes/address";
import { cartRoute } from "./routes/sharedRoutes/cart";
import { productRoute } from "./routes/sharedRoutes/product";
import { uploadRouter } from "./routes/sharedRoutes/upload";
import type { ServerContext } from "./types";

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
	.route("/address", addressRoute)
	.route("/cart", cartRoute)
	.route("/products", productRoute)
	.route("/shops", shopRoute);

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
