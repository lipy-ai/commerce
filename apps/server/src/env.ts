import path from "node:path";
/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";
import { getServerIpAddress } from "./lib/serverIp";

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
	// biome-ignore lint/suspicious/noDoubleEquals: <explanation>
	VITE_USE_IP: z
		.string()
		.optional()
		// biome-ignore lint/suspicious/noDoubleEquals: <explanation>
		.transform((t) => t && t == "true"),
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
	TRANSACTIONAL_EMAIL: z.string(),
	TRUSTED_ORIGINS: z
		.string()
		.transform((t) => t.split(",").map((e) => e.trim())),
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
if (env.VITE_USE_IP) {
	const replaceIp = (value) => {
		if (
			typeof value === "string" &&
			value.startsWith("http") &&
			value.includes("localhost")
		) {
			try {
				const url = new URL(value);
				url.hostname = getServerIpAddress() || "localhost";

				return url.toString().replace(/\/$/, "");
			} catch (e) {
				console.warn(`Invalid URL ${value}`);
			}
		}
	};

	for (const key of Object.keys(env)) {
		const value = env[key];
		let vals: any = null;
		if (Array.isArray(value)) {
			vals = value.map((m) => replaceIp(m));
		} else {
			vals = replaceIp(value);
		}
		vals && (env[key] = vals);
	}
}

export default { ...env, ...rest }!;
