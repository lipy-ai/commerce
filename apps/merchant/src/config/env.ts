const e = import.meta.env;

export const env = {
  IN_PROD: e.NODE_ENV === "production",
  VITE_AUTH_URL: e.VITE_AUTH_URL,
  VITE_DASHBOARD_URL: e.VITE_DASHBOARD_URL,
  VITE_WEB_URL: e.VITE_WEB_URL,
  VITE_AUTH_REDIRECT_URL: e.VITE_WEB_URL + "/account",
  NODE_ENV: e.NODE_ENV,
};
