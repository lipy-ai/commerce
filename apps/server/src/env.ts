import path from "node:path";
/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(
	config({
		path: path.resolve(
			process.cwd(),
			process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		),
	}),
);

const EnvSchema = z.object({
	NODE_ENV: z.string().default("development"),
	PORT: z.coerce.number().default(8080),
	LOG_LEVEL: z.enum([
		"fatal",
		"error",
		"warn",
		"info",
		"debug",
		"trace",
		"silent",
	]),
	DATABASE_URL: z.string().url(),
	// DATABASE_AUTH_TOKEN: z.string().optional(),
	GOOGLE_CLIENT_ID: z.string(),
	VITE_LOCAL_IP: z.string().optional(),
	VITE_POSTHOG_PUBLIC_KEY: z.string(),
	VITE_POSTHOG_HOST: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.string(),
	REDIS_URL: z.string(),
	AWS_SNS_REGION: z.string(),
	AWS_SES_REGION: z.string(),
	AWS_S3_REGION: z.string(),
	AWS_S3_BUCKET: z.string(),
	AWS_ACCESS_KEY: z.string(),
	AWS_SECRET_KEY: z.string(),
	PLUNK_SECRET_KEY: z.string(),
	REPLY_EMAIL: z.string(),
	VITE_MERCHANT_URL: z.string(),
	VITE_WEB_URL: z.string(),
	TRANSACTIONAL_EMAIL: z.string(),
	DISCORD_WEBHOOK: z.string(),
	RESEND_SECRET_KEY: z.string(),
	GOOGLE_MAP_API_KEY: z.string(),
	GOOGLE_SHEET_LEAD: z.string(),
	GOOGLE_WEBSITE_LEAD: z.string(),
	TRUSTED_ORIGINS: z
		.string()
		.transform((t) => t.split(",").map((e) => e.trim())),
	SUPER_ADMINS: z.string().transform((t) => t.split(",").map((e) => e.trim())),
	TWILIO_ACCOUNT_SID: z.string(),
	FIREBASE_SERVICE_ACCOUNT: z.string(),
	TWILIO_AUTH_TOKEN: z.string(),
	GOOGLE_VISION_KEY: z.string().optional(),
	GROQ_API_KEY: z.string().optional(),
});
// .superRefine((input, ctx) => {
//   if (input.NODE_ENV === "production" && !input.DATABASE_AUTH_TOKEN) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.invalid_type,
//       expected: "string",
//       received: "undefined",
//       path: ["DATABASE_AUTH_TOKEN"],
//       message: "Must be set when NODE_ENV is 'production'",
//     });
//   }
// });

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
	console.error("❌ Invalid env:");
	console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
	process.exit(1);
}

const rest = {
	IN_PROD: env.NODE_ENV === "production",
};

if (env.VITE_LOCAL_IP) {
	const replaceIp = (value: unknown) => {
		if (
			typeof value === "string" &&
			value.startsWith("http") &&
			value.includes("localhost")
		) {
			try {
				const url = new URL(value);
				url.hostname = env.VITE_LOCAL_IP || "localhost";

				return url.toString().replace(/\/$/, "");
			} catch (_e) {
				console.warn(`Invalid URL ${value}`);
				return value;
			}
		}
		return value;
	};

	const keys = [
		"WEB_URL",
		"API_URL",
		"AUTH_URL",
		"MERCHANT_URL",
		"AUTH_REDIRECT_URL",
		"TRUSTED_ORIGINS",
	];

	for (const key of Object.keys(env)) {
		const value = (env as any)[key];
		let vals: any = null;

		if (keys.includes(key as any)) {
			if (Array.isArray(value)) {
				vals = [...value, ...value.map((m) => replaceIp(m))];
			} else {
				vals = replaceIp(value);
			}
		}

		vals && ((env as any)[key] = vals);
	}
}

export default { ...env, ...rest }!;
