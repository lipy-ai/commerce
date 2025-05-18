const e = import.meta.env;

export const env = {
  IN_PROD: e.NODE_ENV === "production",
  AUTH_URL: e.VITE_AUTH_URL,
  MERCHANT_URL: e.VITE_MERCHANT_URL,
  WEB_URL: e.VITE_WEB_URL,
  AUTH_REDIRECT_URL: e.VITE_WEB_URL + "/account",
  NODE_ENV: e.VITE_NODE_ENV,
  API_URL: e.VITE_API_URL,
  CDN_URL: e.VITE_CDN_URL,
  M2M_KEY: e.VITE_M2M_KEY,
};
