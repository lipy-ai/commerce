import { betterAuth } from "better-auth";
import { bearer, emailOTP, phoneNumber } from "better-auth/plugins";
import { schema as s } from "@/db/schema";
import { redis } from "@/services/cache";
import { awsSendEmail } from "@/services/ses";
import { sendSMS } from "@/services/sns";
import { db } from "../db";
import env from "../env";
import emailHarmony from "./plugins/emailValidator";
import phoneHarmony from "./plugins/phoneValidator";

const emailOTPPlugin = emailOTP({
	otpLength: 6,
	sendVerificationOTP: async ({ email, otp }) => {
		await awsSendEmail({
			to: email,
			subject: "Login OTP - Lipy",
			html: `Hello,<br/>Login to Lipy using this OTP:<br/><br/><b>${otp}</b>`,
		});
	},
});

const phoneOTPPlugin = phoneNumber({
	otpLength: 6,
	sendOTP: async ({ phoneNumber, code }, _request) => {
		const _data = await sendSMS({
			phoneNumber: phoneNumber,
			message: `Login in to Lipy using this OTP: ${code}`,
		});
	},
	signUpOnVerification: {
		getTempEmail: (phoneNumber) => {
			return `${phoneNumber}@example.com`;
		},
		//optionally, you can also pass `getTempName` function to generate a temporary name for the user
		getTempName: (phoneNumber) => {
			return phoneNumber; //by default, it will use the phone number as the name
		},
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

const schema = s.schemaName;

// const organizationsPlugin = organization({
// 	schema: {
// 		session: {
// 			fields: {
// 				activeOrganizationId: "activeStoreId",
// 			},
// 		},
// 		organization: {
// 			modelName: `${schema}.store`,
// 			fields: {
// 				name: "name",
// 				slug: "handle",
// 				logo: "image",
// 				metadata: "metadata",
// 				createdAt: "createdAt",
// 			},
// 		},
// 		member: {
// 			modelName: `${schema}.storeMember`,
// 			fields: {
// 				userId: "userId",
// 				organizationId: "storeId",
// 				role: "role",
// 				createdAt: "createdAt",
// 			},
// 		},
// 		invitation: {
// 			modelName: `${schema}.storeInvitation`,
// 			fields: {
// 				organizationId: "storeId",
// 				email: "email",
// 				role: "role",
// 				status: "status",
// 				expiresAt: "expiresAt",
// 				inviterId: "inviterId",
// 			},
// 		},
// 	},

// 	async sendInvitationEmail(data) {
// 		const inviteLink = `${env.VITE_MERCHANT_URL}/accept-invitation/${data.id}`;
// 		// await sendTransactionalEmail({
// 		// 	to: [data.email],
// 		// 	subject: `Invitation to join ${data.organization.name}`,
// 		// 	html: `You have been invited to join ${data.organization.name} as ${data.role}. Click the link to join: ${inviteLink}`,
// 		// });

// 		await plunkSendEmail({
// 			to: data.email,
// 			subject: `Invitation to join ${data.organization.name}`,
// 			body: `You have been invited to join ${data.organization.name} as ${data.role}. Click the link to join: ${inviteLink}`,
// 		});
// 	},
// }) as BetterAuthPlugin;

export const auth: any = betterAuth({
	disabledPaths: ["/error"],
	database: {
		db,
		type: "postgres",
		casing: "snake",
	},

	socialProviders,
	plugins: [
		// organizationsPlugin,
		bearer(),
		emailOTPPlugin,
		phoneOTPPlugin,
		emailHarmony(),
		phoneHarmony({ defaultCountry: "IN" }),
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
				// partitioned: true, // (top level domain can modify this cookies, no subdomains)
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

	session: {
		modelName: `${schema}.authSession`,

		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
	user: {
		modelName: `${schema}.user`,

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
		modelName: `${schema}.authAccount`,
	},

	verification: {
		modelName: `${schema}.authVerification`,
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
						.select(["store.id", "storeMember.role", "store.handle"])
						.limit(1)
						.executeTakeFirst();

					return {
						data: {
							...session,
							activeStoreHandle: store?.handle || null,
							activeStoreId: store?.id || null,
							// activeStoreId: "da5f03fa-2f17-4f17-949f-bacefb789fd1",
							// activeStoreHandle: "biriyani-express-and-momos-rw0hd",
							activeStoreRole: store?.role || null,
						},
					};
				},
			},
		},
	},
});

export type AuthType = typeof auth;
