import { Hono } from "hono";

import { showRoutes } from "hono/dev";
import { logger as httpLogger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";

import { logger } from "./lib/logger";

import { emitter } from "@hono/event-emitter";
import { secureHeaders } from "hono/secure-headers";
import { auth } from "./auth";
import { db, pingDatabase } from "./db";
import env from "./env";
import { handlers } from "./events";
import { HTTPError } from "./lib/exception";
import { globalError } from "./lib/globalError";
import { authMiddleware, hasStorePermission } from "./middlewares/auth";
import { corsMiddleware } from "./middlewares/cors";
import { globalMiddleware } from "./middlewares/global";
import { addressRoute } from "./routes/address";
import { cartRoute } from "./routes/cart";
import { merchantComboboxRoute } from "./routes/merchantRoutes/combobox";
import { merchantCustomerRoute } from "./routes/merchantRoutes/customer";
import { eventsRoute } from "./routes/merchantRoutes/events";
import { merchantInventoryRoute } from "./routes/merchantRoutes/inventory";
import { merchantOrderRoute } from "./routes/merchantRoutes/order";
import { merchantProductRoute } from "./routes/merchantRoutes/product";
import { merchantStoreRoute } from "./routes/merchantRoutes/store";
import { merchantVariantRoute } from "./routes/merchantRoutes/variant";
import { orderRoute } from "./routes/order";
import { productRoute } from "./routes/product";
import { shopRoute } from "./routes/shop";
import { uploadRouter } from "./routes/upload";
import type { ServerContext } from "./types";

export const app = new Hono<ServerContext>();

app.use("*", corsMiddleware);

// Generic middlewares
app.use(secureHeaders());
// app.use(tracing);
app.use(httpLogger());
app.use(trimTrailingSlash());
app.use("*", globalMiddleware);

app.use(emitter(handlers));

if (env.NODE_ENV === "development") {
	logger.info("Available routes:");
	showRoutes(app);
}

await pingDatabase();
app.use("*", authMiddleware);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	if (c.req.path === "/api/auth/error") {
		throw new HTTPError(401, {
			message: "Failed to authenticate",
			cause: c.req.query("error"),
		});
	}

	return auth.handler(c.req.raw);
});

// app.use(compress());

export const routes = app
	.basePath("/v1")
	.route("/upload", uploadRouter)
	.route("/address", addressRoute)
	.route("/cart", cartRoute)
	.route("/products", productRoute)
	.route("/shops", shopRoute)
	.route("/order", orderRoute)
	.use(hasStorePermission(["owner", "admin"]))
	.route("/merchant/store", merchantStoreRoute)
	.route("/merchant/product", merchantProductRoute)
	.route("/merchant/variant", merchantVariantRoute)
	.route("/merchant/order", merchantOrderRoute)
	.route("/merchant/customer", merchantCustomerRoute)
	.route("/merchant/combobox", merchantComboboxRoute)
	.route("/merchant/inventory", merchantInventoryRoute)
	.route("/events", eventsRoute);

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

export type AppType = any;
