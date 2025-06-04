import { type BetterAuthOptions, betterAuth } from "better-auth";
import { createAuthMiddleware, emailOTP } from "better-auth/plugins";

import { sendTransactionalEmail } from "@/services/ses";
import { sendSMS } from "@/services/sns";
import { phoneNumber } from "better-auth/plugins";
import { redis } from "../cache";
import { db } from "../db";
import env from "../env";
import emailHarmony from "./plugins/emailValidator";
import phoneHarmony from "./plugins/phoneValidator";

const emailOTPPlugin = emailOTP({
	otpLength: 6,
	sendVerificationOTP: async ({ email, otp }) => {
		const data = await sendTransactionalEmail({
			to: [email],
			subject: "Login OTP - Lipy",
			html: `Hello,<br/>Login to Lipy using this OTP:<br/><br/><b>${otp}</b>`,
		});
		console.log(data);
	},
});

const phoneOTPPlugin = phoneNumber({
	otpLength: 6,
	sendOTP: async ({ phoneNumber, code }, _request) => {
		const data = await sendSMS({
			phoneNumber,
			message: `Login in to Lipy using this OTP: ${code}`,
		});
		console.log(data);
	},
});

const afterAuthMiddleware = createAuthMiddleware(async (ctx) => {
	// ctx.setCookie("my-cookie", "value");
	// await ctx.setSignedCookie("my-signed-cookie", "value", ctx.context.secret, {
	//     maxAge: 1000,
	// });
	// const cookie = ctx.getCookies("my-cookie");
	// const signedCookie = await ctx.getSignedCookies("my-signed-cookie");
	// const session_token = ctx.getCookie("lipy.session_token");
	// const session_data = ctx.getCookie("lipy.session_data");
	// const opts = {
	// 	domain: "http://192.168.185.119:3000", // Set to your IP
	// 	path: "/",
	// 	httpOnly: false, // Set to true if you don't need client-side access
	// 	secure: false, // Must be false for HTTP
	// 	sameSite: "none", // Required for cross-domain
	// } satisfies CookieOptions;
	// if (session_token) {
	// 	ctx.setCookie("lipy.session_token1", session_token, opts);
	// }
	// if (session_data) {
	// 	ctx.setCookie("lipy.session_data1", session_data, opts);
	// }
});

const socialProviders: BetterAuthOptions["socialProviders"] = {
	google: {
		clientId: env.GOOGLE_CLIENT_ID as string,
		clientSecret: env.GOOGLE_CLIENT_SECRET as string,
	},
	//   microsoft: {
	//     clientId: env.MICROSOFT_CLIENT_ID as string,
	//     clientSecret: env.MICROSOFT_CLIENT_SECRET as string,
	//   },
};

export const auth = betterAuth({
	disabledPaths: ["/error"],
	database: {
		db,
		type: "postgres",
		casing: "snake",
	},

	socialProviders,
	plugins: [emailOTPPlugin, phoneOTPPlugin, emailHarmony(), phoneHarmony()],
	hooks: {
		// before: beforeAuthMiddleware,
		after: afterAuthMiddleware,
	},
	advanced: {
		database: {
			generateId: () => crypto.randomUUID(),
		},
		cookiePrefix: "lipy",
		crossSubDomainCookies: {
			enabled: true,
			...(env.IN_PROD && {
				domain: `.${env.BETTER_AUTH_URL.split(".").slice(1).join(".")}`,
			}),
		},

		...(env.IN_PROD && {
			useSecureCookies: true,
		}),
		...(env.IN_PROD && {
			defaultCookieAttributes: {
				secure: env.IN_PROD,
				httpOnly: env.IN_PROD,
				sameSite: "none", // Allows CORS-based cookie sharing across subdomains
				partitioned: true, // New browser standards will mandate this for foreign cookies
			},
		}),
	},
	trustedOrigins: env.TRUSTED_ORIGINS,

	secondaryStorage: {
		get: async (key) => {
			const value = await redis.get(key);
			return value ? value : null;
		},
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(key, value, "EX", ttl);
			else await redis.set(key, value);
		},
		delete: async (key) => {
			await redis.del(key);
		},
	},
	databaseHooks: {
		session: {
			create: {
				before: async (session) => {
					const store = await db
						.selectFrom("store")
						.innerJoin("storeMember", "storeMember.storeId", "store.id")
						.innerJoin("user", "user.id", "storeMember.userId")
						.where("user.id", "=", session.userId)
						.select("store.id")
						.limit(1)
						.executeTakeFirst();
					return {
						data: {
							...session,
							activeStoreId: store?.id || null,
						},
					};
				},
			},
		},
	},
	session: {
		modelName: "lipy.authSession",
		// fields: {
		//   userId: "user_id",
		//   sessionToken: "session_token",
		//   createdAt: "created_at",
		//   updatedAt: "updated_at",
		// },
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
	user: {
		modelName: "lipy.user",
		// fields: {
		//   name: "name",
		//   email: "email",
		//   username: "username",
		//   emailVerified: "email_verified",
		//   image: "image",
		//   createdAt: "created_at",
		//   updatedAt: "updated_at",
		//   normalizedEmail: "normalized_email",
		// },
		deleteUser: {
			enabled: true,
		},
		additionalFields: {
			address: {
				type: "string",
			},
			onboarded: {
				type: "boolean",
				required: true,
				defaultValue: false,
				input: false,
			},
		},
	},

	account: {
		modelName: "lipy.authAccount",
		// fields: {
		//   accountId: "account_id",
		//   providerId: "provider_id",
		//   accessToken: "access_token",
		//   refreshToken: "refresh_token",
		//   idToken: "id_token",
		//   accessTokenExpiresAt: "access_token_expires_at",
		//   refreshTokenExpiresAt: "refresh_token_expires_at",
		//   userId: "user_id",
		//   type: "type",
		//   provider: "provider",
		//   providerAccountId: "provider_account_id",
		//   createdAt: "created_at",
		//   updatedAt: "updated_at",
		// },
	},

	verification: {
		modelName: "lipy.authVerification",
		// fields: {
		//   expiresAt: "expires_at",
		//   createdAt: "created_at",
		//   updatedAt: "updated_at",
		// },
	},
});

export type AuthType = typeof auth;
