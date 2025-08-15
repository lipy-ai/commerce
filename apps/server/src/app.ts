import { emitter } from "@hono/event-emitter";
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { logger as httpLogger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { trimTrailingSlash } from "hono/trailing-slash";
import { auth } from "./auth";
import { db, pingDatabase } from "./db";
import env from "./env";
import { handlers } from "./events";
import { HTTPError } from "./lib/exception";
import { globalError } from "./lib/globalError";
import { logger } from "./lib/logger";
import {
	authMiddleware,
	hasStorePermission,
	isLoggedIn,
	isSuperAdmin,
} from "./middlewares/auth";
import { corsMiddleware } from "./middlewares/cors";
import { globalMiddleware } from "./middlewares/global";
import { adminCategoryRoute } from "./routes/adminRoutes";
import { adminProductRoute } from "./routes/adminRoutes/products";
import { adminReviewProductRoute } from "./routes/adminRoutes/reviewProducts";
import { adminTestRoute } from "./routes/adminRoutes/test";
import { adminVariantRoute } from "./routes/adminRoutes/variant";
import { addressRoute } from "./routes/loggedRoutes/address";
import { cartRoute } from "./routes/loggedRoutes/cart";
import { orderRoute } from "./routes/loggedRoutes/order";
import { loggedInSessionRoute } from "./routes/loggedRoutes/session";
import { loggedStoreRoute } from "./routes/loggedRoutes/shop";
import { uploadRoute } from "./routes/loggedRoutes/upload";
import { merchantComboboxRoute } from "./routes/merchantRoutes/combobox";
import { merchantCouponRoute } from "./routes/merchantRoutes/coupon";
import { merchantCustomerRoute } from "./routes/merchantRoutes/customer";
import { merchantDashboardRoute } from "./routes/merchantRoutes/dashboard";
import { eventsRoute } from "./routes/merchantRoutes/events";
import { merchantInventoryRoute } from "./routes/merchantRoutes/inventory";
import { merchantProductRoute } from "./routes/merchantRoutes/product";
import { merchantStoreRoute } from "./routes/merchantRoutes/store";
import { posOrderRoute } from "./routes/posRoutes/order";
import { posProductRoute } from "./routes/posRoutes/product";
import { posStoreRoute } from "./routes/posRoutes/shop";
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

const adminRouter = new Hono()
	.basePath("/admin")
	.use(isSuperAdmin)
	.route("/product", adminProductRoute)
	.route("/category", adminCategoryRoute)
	.route("/variant", adminVariantRoute)
	.route("/review-products", adminReviewProductRoute)
	.route("/test", adminTestRoute);

const merchantRouter = new Hono()
	.basePath("/merchant")
	.use(isLoggedIn) //Check if logged In
	.use(hasStorePermission(["owner", "admin"])) // check if staff role is "owner" || "admin"
	.route("/store", merchantStoreRoute)
	.route("/product", merchantProductRoute)
	// .route("/order", merchantOrderRoute)
	.route("/customer", merchantCustomerRoute)
	.route("/combobox", merchantComboboxRoute)
	.route("/inventory", merchantInventoryRoute)
	.route("/events", eventsRoute)
	.route("/dashboard", merchantDashboardRoute)
	.route("/coupon", merchantCouponRoute);

const posRouter = new Hono()
	.basePath("/pos")
	.use(isLoggedIn) //Check if logged In
	.use(hasStorePermission(["owner", "admin", "staff"]))
	.route("/product", posProductRoute)
	.route("/order", posOrderRoute)
	.route("/store", posStoreRoute);

const loggedRouter = new Hono()
	.use(isLoggedIn) //Check if logged In
	.route("/session", loggedInSessionRoute)
	.route("/upload", uploadRoute)
	.route("/address", addressRoute)
	.route("/cart", cartRoute)
	.route("/store", loggedStoreRoute)
	.route("/order", orderRoute);

export const routes = app
	.basePath("/v1")
	.route("/public/products", productRoute)
	.route("/public/shops", shopRoute)
	.route("/", loggedRouter)
	.route("/", merchantRouter)
	.route("/", adminRouter)
	.route("/", posRouter);
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
