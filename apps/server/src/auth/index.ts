import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";

import { sendTransactionalEmail } from "@/services/ses";
import { sendSMS } from "@/services/sns";
import { phoneNumber } from "better-auth/plugins";
import { organization } from "better-auth/plugins";
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

const socialProviders = {
	google: {
		clientId: env.GOOGLE_CLIENT_ID as string,
		clientSecret: env.GOOGLE_CLIENT_SECRET as string,
	},
	//   microsoft: {
	//     clientId: env.MICROSOFT_CLIENT_ID as string,
	//     clientSecret: env.MICROSOFT_CLIENT_SECRET as string,
	//   },
};

const organizationsPlugin = organization({
	schema: {
		organization: {
			modelName: "lipy.store",
			fields: {
				name: "name",
				slug: "handle",
				logo: "image",
				metadata: "metadata",
				createdAt: "createdAt",
			},
		},
		member: {
			modelName: "lipy.storeMember",
			fields: {
				userId: "userId",
				organizationId: "storeId",
				role: "role",
				createdAt: "createdAt",
			},
		},
		invitation: {
			modelName: "lipy.storeInvitation",
			fields: {
				organizationId: "storeId",
				email: "email",
				role: "role",
				status: "status",
				expiresAt: "expiresAt",
				inviterId: "inviterId",
			},
		},
	},
});
export const auth : any= betterAuth({
	disabledPaths: ["/error"],
	database: {
		db,
		type: "postgres",
		casing: "snake",
	},

	socialProviders,
	plugins: [
		emailOTPPlugin,
		phoneOTPPlugin,
		organizationsPlugin,
		emailHarmony(),
		phoneHarmony(),
	],
	hooks: {
		// before: beforeAuthMiddleware,
		// after: afterAuthMiddleware,
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
						.where("store.active", "=", true)
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

		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
	user: {
		modelName: "lipy.user",

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
	},

	verification: {
		modelName: "lipy.authVerification",
	},
});

export type AuthType = typeof auth;
