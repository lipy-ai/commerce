const e = import.meta.env;

export const env = {
	IN_PROD: e.NODE_ENV === "production",
	GTAG_ID: e.VITE_GTAG_ID,
	// biome-ignore lint/suspicious/noDoubleEquals: <explanation>
	VITE_LOCAL_IP: e.VITE_LOCAL_IP,
	AUTH_URL: e.VITE_AUTH_URL,
	MERCHANT_URL: e.VITE_MERCHANT_URL,
	WEB_URL: e.VITE_WEB_URL,
	AUTH_REDIRECT_URL: `${e.VITE_WEB_URL}/account`,
	NODE_ENV: e.VITE_NODE_ENV,
	API_URL: e.VITE_API_URL,
	CDN_URL: e.VITE_CDN_URL,
	GOOGLE_MAP_API_KEY: e.VITE_GOOGLE_MAP_API_KEY,
	SHOW_DEV_TOOLS: true,
	GOOGLE_MAP_LIBRARIES: e.VITE_GOOGLE_MAP_LIBRARIES?.split(","),
	POSTHOG_PUBLIC_KEY: e.VITE_POSTHOG_PUBLIC_KEY,
	POSTHOG_HOST: e.VITE_POSTHOG_HOST,
	INSTAGRAM: "https://www.instagram.com/lipynow",
	LINKEDIN: "https://www.linkedin.com/company/lipy-in",
};

if (env.VITE_LOCAL_IP) {
	for (const key of Object.keys(env)) {
		const value = env[key as keyof typeof env];

		const keys = [
			"WEB_URL",
			"API_URL",
			"AUTH_URL",
			"MERCHANT_URL",
			"AUTH_REDIRECT_URL",
		] satisfies Partial<keyof typeof env>[];
		if (
			keys.includes(key as any) &&
			typeof value === "string" &&
			value.startsWith("http") &&
			value.includes("localhost")
		) {
			try {
				const url = new URL(value);
				url.hostname = env.VITE_LOCAL_IP || "localhost";

				(env as any)[key as any] = url.toString().replace(/\/$/, "");
			} catch (e) {
				console.warn(`Invalid URL in env[${key}]:`, value);
			}
		}
	}
	console.log(env);
}
