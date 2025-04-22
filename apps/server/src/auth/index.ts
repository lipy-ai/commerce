import { betterAuth, BetterAuthOptions } from "better-auth";
import { emailOTP, magicLink, organization } from "better-auth/plugins";

import env from "../env";
import { redis } from "../cache";
import { db, pool } from "../db";
import { sendTransactionalEmail } from "@/services/ses";
import { phoneNumber } from "better-auth/plugins";
import { sendSMS } from "@/services/sns";

const organizationPlugin = organization({
  schema: {
    organization: {
      modelName: "org.list",
    },
    member: {
      modelName: "org.member",
    },
    invitation: {
      modelName: "org.invitation",
    },
  },
});

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

// const afterAuthMiddleware = createAuthMiddleware(async (ctx) => {
//   const newSession = ctx.context.newSession
//   if (!newSession) return
//   console.log("New Session")
//   if (!newSession.session.activeOrganizationId) {
//     console.log("No active organization")
//     let orgId = ""

// await db
//   .selectFrom("org.list")
//   .innerJoin("org.member", "org.member.organizationId", "org.list.id")
//   .innerJoin("auth.user", "auth.user.id", "org.member.userId")
//   .where("auth.user.id", "=", newSession!.user.id)
//   .select("org.list.id")
//   .limit(1)
//   .executeTakeFirst()
//   .then((o) => {
//     if (o?.id) {
//       orgId = o?.id
//     }
//   })

//     if (orgId) {
//       await db
//         .updateTable("auth.session")
//         .where("auth.session.id", "=", newSession.session.id)
//         .set({ activeOrganizationId: orgId })
//         .execute()
//       return true
//     }
//     return redirect("/create/org")
//   }
// })

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
  // database: drizzleAdapter(db, { provider: "pg" }),
  database: {
    db,
    type: "postgres",
    casing: "snake",
  },

  socialProviders,
  plugins: [organizationPlugin, emailOTPPlugin, phoneOTPPlugin],
  trustedOrigins: env.TRUSTED_ORIGINS,
  hooks: {
    // before: beforeAuthMiddleware,
    // after: afterAuthMiddleware,
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },
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
          const organization = await db
            .selectFrom("org.list")
            .innerJoin(
              "org.member",
              "org.member.organization_id",
              "org.list.id"
            )
            .innerJoin("auth.user", "auth.user.id", "org.member.user_id")
            .where("auth.user.id", "=", session.userId)
            .select("org.list.id")
            .limit(1)
            .executeTakeFirst();
          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id || null,
            },
          };
        },
      },
    },
  },
  session: {
    modelName: "auth.session",
    fields: {
      userId: "user_id",
      sessionToken: "session_token",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  user: {
    modelName: "auth.user",
    fields: {
      name: "name",
      email: "email",
      username: "username",
      emailVerified: "email_verified",
      image: "image",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      customer_id: {
        type: "string",
        required: false,
        defaultValue: null,
        input: false,
      },
      country: {
        type: "string",
        required: false,
        defaultValue: null,
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
    modelName: "auth.account",
    fields: {
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      userId: "user_id",
      type: "type",
      provider: "provider",
      providerAccountId: "provider_account_id",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  verification: {
    modelName: "auth.verification",
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
});

export type AuthType = typeof auth;
