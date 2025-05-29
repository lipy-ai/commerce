import { betterAuth, type BetterAuthOptions } from "better-auth";
import { emailOTP } from "better-auth/plugins";

import env from "../env";
import { redis } from "../cache";
import { db } from "../db";
import { sendTransactionalEmail } from "@/services/ses";
import { phoneNumber } from "better-auth/plugins";
import { sendSMS } from "@/services/sns";
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

export const auth:ReturnType<typeof betterAuth> = betterAuth({
  // database: drizzleAdapter(db, { provider: "pg" }),
  database: {
    db,
    type: "postgres",
    casing: "snake",
  },

  socialProviders,
  plugins: [
    emailOTPPlugin,
    phoneOTPPlugin,
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
    crossSubDomainCookies: {
      enabled: true,
      ...(env.IN_PROD && {
        domain: `.${env.BETTER_AUTH_URL.split(".").slice(1).join(".")}`,
      }), // Domain with a leading period
    },
    ...(env.IN_PROD && {
      useSecureCookies: true,
    }),
    ...(env.IN_PROD && {
      defaultCookieAttributes: {
        secure: true,
        httpOnly: true,
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
