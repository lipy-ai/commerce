import type { Context, Env } from "hono";

export * from "./auth";

import type { Emitter } from "@hono/event-emitter";
import type { Session, User } from "better-auth";
import type { AvailableEvents } from "@/events";
import type { ErrCode } from "@/lib/exception";
import type { STORE_ROLES } from "@/middlewares/auth";
import type { adminCategoryRoute } from "@/routes/adminRoutes";
import type { adminProductRoute } from "@/routes/adminRoutes/products";
import type { adminVariantRoute } from "@/routes/adminRoutes/variant";
import type { addressRoute } from "@/routes/loggedRoutes/address";
import type { cartRoute } from "@/routes/loggedRoutes/cart";
import type { orderRoute } from "@/routes/loggedRoutes/order";
import type { uploadRoute } from "@/routes/loggedRoutes/upload";
import type { merchantComboboxRoute } from "@/routes/merchantRoutes/combobox";
import type { merchantCustomerRoute } from "@/routes/merchantRoutes/customer";
import type { merchantDashboardRoute } from "@/routes/merchantRoutes/dashboard";
import type { eventsRoute } from "@/routes/merchantRoutes/events";
import type { merchantInventoryRoute } from "@/routes/merchantRoutes/inventory";
import type { merchantOrderRoute } from "@/routes/merchantRoutes/order";
import type { merchantProductRoute } from "@/routes/merchantRoutes/product";
import type { merchantStoreRoute } from "@/routes/merchantRoutes/store";
import type { productRoute } from "@/routes/publicRoutes/product";
import type { shopRoute } from "@/routes/publicRoutes/shop";

// import type {
// 	EmitAsyncOptions,
// 	EventHandler,
// 	EventPayloadMap,
// } from "@hono/event-emitter";

// interface Emitter<EPMap extends EventPayloadMap> {
// 	on<Key extends keyof EPMap>(
// 		key: Key,
// 		handler: EventHandler<EPMap[Key]>,
// 	): void;
// 	off<Key extends keyof EPMap>(
// 		key: Key,
// 		handler?: EventHandler<EPMap[Key]>,
// 	): void;
// 	emit<Key extends keyof EPMap>(
// 		c: Context<ServerContext>,
// 		key: Key,
// 		payload: EPMap[Key],
// 	): void;
// 	emitAsync<Key extends keyof EPMap>(
// 		c: Context<ServerContext>,
// 		key: Key,
// 		payload: EPMap[Key],
// 		options?: EmitAsyncOptions,
// 	): Promise<void>;
// }

export interface ServerContext extends Env {
	Variables: {
		emitter: Emitter<AvailableEvents>;
		user:
			| (User & {
					phoneNumber?: string;
					phoneNumberVerified?: boolean;
			  })
			| null;
		session:
			| (Session & {
					activeStoreId: string | null;
					activeStoreRole: (typeof STORE_ROLES)[number] | null;
			  })
			| null;
	};
}

export type SuccessResponse<T = void> = {
	success: true;
	message: string;
} & (T extends void ? {} : { data: T });

export type ErrorResponse = {
	success: false;
	error: { message: string; cause: any; code?: ErrCode };
};

export type AwaitedReturn<T extends (...args: any) => any> = Awaited<
	ReturnType<T>
>;

export type HonoContext = Context;

// Admin Routes

export type AdminProductRoute = typeof adminProductRoute;
export type AdminCategoryRoute = typeof adminCategoryRoute;
export type AdminVariantRoute = typeof adminVariantRoute;

// Merchant Routes
export type MerchantStoreRoute = typeof merchantStoreRoute;
export type MerchantProductRoute = typeof merchantProductRoute;
export type MerchantOrderRoute = typeof merchantOrderRoute;
export type MerchantCustomerRoute = typeof merchantCustomerRoute;
export type MerchantComboboxRoute = typeof merchantComboboxRoute;
export type MerchantInventoryRoute = typeof merchantInventoryRoute;
export type MerchantEventsRoute = typeof eventsRoute;
export type MerchantDashboardRoute = typeof merchantDashboardRoute;
export type MerchantCouponRoute = typeof merchantCouponRoute;

// Logged In Routes
export type LoggedInUploadRoute = typeof uploadRoute;
export type LoggedInAddressRoute = typeof addressRoute;
export type LoggedInCartRoute = typeof cartRoute;
export type LoggedIOrderRoute = typeof orderRoute;

// Public Routes
export type PublicProductRoute = typeof productRoute;
export type PublicShopRoute = typeof shopRoute;
