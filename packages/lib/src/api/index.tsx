import { env } from "@envClient";
import type { adminCategoryRoute } from "@lipy/server/routes/adminRoutes";
import type { adminProductRoute } from "@lipy/server/routes/adminRoutes/products";
import type { adminReviewProductRoute } from "@lipy/server/routes/adminRoutes/reviewProducts";
import type { adminVariantRoute } from "@lipy/server/routes/adminRoutes/variant";
import type { addressRoute } from "@lipy/server/routes/loggedRoutes/address";
import type { cartRoute } from "@lipy/server/routes/loggedRoutes/cart";
import type { orderRoute } from "@lipy/server/routes/loggedRoutes/order";
import type { loggedInSessionRoute } from "@lipy/server/routes/loggedRoutes/session";
import type { loggedStoreRoute } from "@lipy/server/routes/loggedRoutes/shop";
import type { uploadRoute } from "@lipy/server/routes/loggedRoutes/upload";
import type { merchantComboboxRoute } from "@lipy/server/routes/merchantRoutes/combobox";
import type { merchantCustomerRoute } from "@lipy/server/routes/merchantRoutes/customer";
import type { merchantDashboardRoute } from "@lipy/server/routes/merchantRoutes/dashboard";
import type { eventsRoute } from "@lipy/server/routes/merchantRoutes/events";
import type { merchantInventoryRoute } from "@lipy/server/routes/merchantRoutes/inventory";
import type { merchantProductRoute } from "@lipy/server/routes/merchantRoutes/product";
import type { merchantStoreRoute } from "@lipy/server/routes/merchantRoutes/store";
import type { posOrderRoute } from "@lipy/server/routes/posRoutes/order";
import type { posProductRoute } from "@lipy/server/routes/posRoutes/product";
import type { posStoreRoute } from "@lipy/server/routes/posRoutes/shop";
import type { productRoute } from "@lipy/server/routes/publicRoutes/product";
import type { shopRoute } from "@lipy/server/routes/publicRoutes/shop";
import { type ClientRequestOptions, hc } from "hono/client";

const opts: ClientRequestOptions = {
  init: {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  },
};

// export const apiClient = hc(env.API_URL!, opts);

// Admin Routes
const basepath = `${env.API_URL!}/v1`;
export const adminProductApi = hc<typeof adminProductRoute>(
  `${basepath}/admin/product`,
  opts
);
export const adminVariantApi = hc<typeof adminVariantRoute>(
  `${basepath}/admin/variant`,
  opts
);
export const adminCategoryApi = hc<typeof adminCategoryRoute>(
  `${basepath}/admin/category`,
  opts
);

export const adminReviewProductApi = hc<typeof adminReviewProductRoute>(
  `${basepath}/admin/review-products`,
  opts
);

// Merchant Routes
export const merchantStoreApi = hc<typeof merchantStoreRoute>(
  `${basepath}/merchant/store`,
  opts
);

export const merchantProductApi = hc<typeof merchantProductRoute>(
  `${basepath}/merchant/product`,
  opts
);

export const merchantCustomerApi = hc<typeof merchantCustomerRoute>(
  `${basepath}/merchant/customer`,
  opts
);

export const merchantComboboxApi = hc<typeof merchantComboboxRoute>(
  `${basepath}/merchant/combobox`,
  opts
);

export const merchantInventoryApi = hc<typeof merchantInventoryRoute>(
  `${basepath}/merchant/inventory`,
  opts
);
export const merchantEventsApi = hc<typeof eventsRoute>(
  `${basepath}/merchant/events`,
  opts
);
export const merchantDashboardApi = hc<typeof merchantDashboardRoute>(
  `${basepath}/merchant/dashboard`,
  opts
);

// POS

export const posProductApi = hc<typeof posProductRoute>(
  `${basepath}/pos/product`,
  opts
);

export const posOrderApi = hc<typeof posOrderRoute>(
  `${basepath}/pos/order`,
  opts
);
export const posStoreApi = hc<typeof posStoreRoute>(
  `${basepath}/pos/store`,
  opts
);

// Logged In Routes
export const loggedInUploadApi = hc<typeof uploadRoute>(
  `${basepath}/upload`,
  opts
);
export const loggedInAddressApi = hc<typeof addressRoute>(
  `${basepath}/address`,
  opts
);
export const loggedInSessionApi = hc<typeof loggedInSessionRoute>(
  `${basepath}/session`,
  opts
);
export const loggedInCartApi = hc<typeof cartRoute>(`${basepath}/cart`, opts);
export const loggedIOrderApi = hc<typeof orderRoute>(`${basepath}/order`, opts);
export const loggedInStoreApi = hc<typeof loggedStoreRoute>(
  `${basepath}/store`,
  opts
);

// Public Routes
export const publicProductApi = hc<typeof productRoute>(
  `${basepath}/public/products`,
  opts
);
export const publicShopApi = hc<typeof shopRoute>(
  `${basepath}/public/shops`,
  opts
);
