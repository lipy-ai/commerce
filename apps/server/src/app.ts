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
import {
	authMiddleware,
	hasStorePermission,
	isLoggedIn,
} from "./middlewares/auth";
import { corsMiddleware } from "./middlewares/cors";
import { globalMiddleware } from "./middlewares/global";
import { addressRoute } from "./routes/loggedRoutes/address";
import { cartRoute } from "./routes/loggedRoutes/cart";
import { orderRoute } from "./routes/loggedRoutes/order";
import { uploadRouter } from "./routes/loggedRoutes/upload";
import { merchantComboboxRoute } from "./routes/merchantRoutes/combobox";
import { merchantCustomerRoute } from "./routes/merchantRoutes/customer";
import { merchantDashboardRoute } from "./routes/merchantRoutes/dashboard";
import { eventsRoute } from "./routes/merchantRoutes/events";
import { merchantInventoryRoute } from "./routes/merchantRoutes/inventory";
import { merchantOrderRoute } from "./routes/merchantRoutes/order";
import { merchantProductRoute } from "./routes/merchantRoutes/product";
import { merchantStoreRoute } from "./routes/merchantRoutes/store";
import { merchantVariantRoute } from "./routes/merchantRoutes/variant";
import { productRoute } from "./routes/publicRoutes/product";
import { shopRoute } from "./routes/publicRoutes/shop";
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

const merchantRouter = new Hono()
	.basePath("/merchant")
	.use(isLoggedIn) //Check if logged In
	.use(hasStorePermission(["owner", "admin"])) // check if staff role is "owner" || "admin"
	.route("/store", merchantStoreRoute)
	.route("/product", merchantProductRoute)
	.route("/variant", merchantVariantRoute)
	.route("/order", merchantOrderRoute)
	.route("/customer", merchantCustomerRoute)
	.route("/combobox", merchantComboboxRoute)
	.route("/inventory", merchantInventoryRoute)
	.route("/events", eventsRoute)
	.route("/dashboard", merchantDashboardRoute);

const loggedRouter = new Hono()
	.use(isLoggedIn) //Check if logged In
	.route("/upload", uploadRouter)
	.route("/address", addressRoute)
	.route("/cart", cartRoute)
	.route("/products", productRoute)
	.route("/shops", shopRoute)
	.route("/order", orderRoute);

export const routes = app
	.basePath("/v1")
	.route("/public/products", productRoute)
	.route("/public/shops", shopRoute)
	.route("/", loggedRouter)
	.route("/", merchantRouter);

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
