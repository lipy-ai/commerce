const e = import.meta.env;

export const env = {
  IN_PROD: e.NODE_ENV === "production",
  AUTH_URL: e.VITE_AUTH_URL,
  DASHBOARD_URL: e.VITE_DASHBOARD_URL,
  WEB_URL: e.VITE_WEB_URL,
  AUTH_REDIRECT_URL: e.VITE_WEB_URL + "/account",
  NODE_ENV: e.NODE_ENV,
  API_URL: "http://localhost:8080",
  CDN_URL: "https://cdn.lipy.ai",
};
