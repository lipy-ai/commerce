import type { User } from "better-auth";
import { APIError } from "better-auth/api";
import { createAuthMiddleware } from "better-auth/plugins";
import type { BetterAuthPlugin } from "better-auth/types";
import Mailchecker from "mailchecker";
import isEmail from "validator/es/lib/isEmail";
import normalizeEmail from "validator/es/lib/normalizeEmail";

import type { HookEndpointContext } from "better-auth";

export type Matcher = (context: HookEndpointContext) => boolean;

const paths = [
	"/sign-up/email",
	"/email-otp/verify-email",
	"/sign-in/email-otp",
	"/sign-in/magic-link",
	"/sign-in/email",
	"/forget-password/email-otp",
	"/email-otp/reset-password",
	"/email-otp/create-verification-otp",
	"/email-otp/get-verification-otp",
	"/email-otp/send-verification-otp",
	"/forget-password",
	"/send-verification-email",
	"/change-email",
];

const all = new Set(paths);
const signIn = new Set(paths.slice(1, 12));

/**
 * Path is one of `[
 *   '/sign-up/email',
 *   '/email-otp/verify-email',
 *   '/sign-in/email-otp',
 *   '/sign-in/magic-link',
 *   '/sign-in/email',
 *   '/forget-password/email-otp',
 *   '/email-otp/reset-password',
 *   '/email-otp/create-verification-otp',
 *   '/email-otp/get-verification-otp',
 *   '/email-otp/send-verification-otp',
 *   '/forget-password',
 *   '/send-verification-email',
 *   '/change-email'
 * ]`.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const allEmail: Matcher = ({ path }) => all.has(path);

/**
 * Path is one of `[
 *   '/email-otp/verify-email',
 *   '/sign-in/email-otp',
 *   '/sign-in/magic-link',
 *   '/sign-in/email',
 *   '/forget-password/email-otp',
 *   '/email-otp/reset-password',
 *   '/email-otp/create-verification-otp',
 *   '/email-otp/get-verification-otp',
 *   '/email-otp/send-verification-otp',
 *   '/forget-password',
 *   '/send-verification-email'
 * ]`.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const allEmailSignIn: Matcher = ({ path }) => signIn.has(path);

/**
 * Path is `'/sign-up/email'`.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const emailSignUp: Matcher = ({ path }) => path === "/sign-up/email";

/**
 * Path is `'/sign-in/email'`, used to log the user in.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const emailSignIn: Matcher = ({ path }) => path === "/sign-in/email";

/**
 * Path is `'/forget-password'`, used in the forgot password flow..
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const emailForget: Matcher = ({ path }) => path === "/forget-password";

/**
 * Path is `'/send-verification-email'`, used to log the user in.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const emailSendVerification: Matcher = ({ path }) =>
	path === "/send-verification-email";

/**
 * Path is `'/change-email'`, used to update the user's email address.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const changeEmail: Matcher = ({ path }) => path === "/change-email";

/**
 * Path is `'/email-otp/verify-email'`, used by the [Email
 * OTP](https://www.better-auth.com/docs/plugins/email-otp) plugin.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const emailOtpVerify: Matcher = ({ path }) =>
	path === "/email-otp/verify-email";

/**
 * Path is `'/forget-password/email-otp'`, used by the [Email
 * OTP](https://www.better-auth.com/docs/plugins/email-otp) plugin.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const emailOtpForget: Matcher = ({ path }) =>
	path === "/forget-password/email-otp";

/**
 * Path is `'/email-otp/reset-password'`, used by the [Email
 * OTP](https://www.better-auth.com/docs/plugins/email-otp) plugin.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const emailOtpReset: Matcher = ({ path }) =>
	path === "/email-otp/reset-password";

/**
 * Path is `'/email-otp/create-verification-otp'`, used by the [Email
 * OTP](https://www.better-auth.com/docs/plugins/email-otp) plugin.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const emailOtpCreateVerification: Matcher = ({ path }) =>
	path === "/email-otp/create-verification-otp";

/**
 * Path is `'/email-otp/get-verification-otp'`, used by the [Email
 * OTP](https://www.better-auth.com/docs/plugins/email-otp) plugin.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const emailOtpGetVerification: Matcher = ({ path }) =>
	path === "/email-otp/get-verification-otp";

/**
 * Path is `'/email-otp/send-verification-otp'`, used by the [Email
 * OTP](https://www.better-auth.com/docs/plugins/email-otp) plugin.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const emailOtpSendVerification: Matcher = ({ path }) =>
	path === "/email-otp/send-verification-otp";

/**
 * Path is `'/sign-in/magic-link'`, used by the [Magic
 * link](https://www.better-auth.com/docs/plugins/magic-link) plugin.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const magicLinkSignIn: Matcher = ({ path }) =>
	path === "/sign-in/magic-link";

export interface UserWithNormalizedEmail extends User {
	normalizedEmail?: string | null;
}

export interface EmailHarmonyOptions {
	/**
	 * Allow logging in with any version of the unnormalized email address. Also works for password
	 * reset. For example a user who signed up with the email `johndoe@googlemail.com` may also log
	 * in with `john.doe@gmail.com`. Makes 1 extra database query for every login attempt.
	 * @default false
	 */
	allowNormalizedSignin?: boolean;
	/**
	 * Function to validate email. Default is `validateEmail`.
	 */
	validator?: (email: string) => boolean | Promise<boolean>;
	/**
	 * Function to normalize email address. Default is `validator.normalizeEmail(t)`.
	 * @see https://github.com/validatorjs/validator.js#sanitizers
	 */
	normalizer?: typeof normalizeEmail;
	/**
	 * Specify in which routes the plugin should run, for example by path.
	 * @example <caption>Ready-made matchers</caption>
	 * import * as matchers from 'better-auth-harmony/email/matchers';
	 *
	 * export const auth = betterAuth({
	 *   // ... other config options
	 *   plugins: [
	 *     emailHarmony({
	 *       matchers: {
	 *         signIn: [matchers.emailOtpVerify, matchers.emailOtpForget, matchers.emailOtpReset]
	 *       }
	 *     })
	 *   ]
	 * });
	 */
	matchers?: {
		/**
		 * Specify where the plugin should run to look up users by normalized email address if
		 * `allowNormalizedSignin` is true.
		 * @default [`allEmailSignIn`]
		 */
		signIn?: Matcher[];
		/**
		 * Specify which requests the plugin should validate, for example in which routes by path.
		 * @default [`allEmail`]
		 */
		validation?: Matcher[];
	};
}

interface Context {
	body?: Record<string, unknown>;
	query?: Record<string, unknown>;
}

/**
 * The default validation function runs `validator.isEmail(email) && Mailchecker.isValid(email)`.
 * @see https://github.com/validatorjs/validator.js#validators
 * @see https://github.com/FGRibreau/mailchecker
 * @param email The email address to validate
 * @returns Boolean indicating whether the address should be accepted (`true`), or rejected
 *   (`false`).
 */
export const validateEmail = (email: string) =>
	isEmail(email) && Mailchecker.isValid(email);

type GetEmail = (ctx: Context) => {
	email: unknown;
	container: "body" | "query";
};
const getEmail: GetEmail = (ctx) => ({
	email: ctx.body?.email ?? ctx.query?.email,
	container: ctx.body ? "body" : "query",
});

const emailHarmony = ({
	allowNormalizedSignin = false,
	validator = validateEmail,
	matchers = {},
	normalizer = normalizeEmail,
}: EmailHarmonyOptions = {}): BetterAuthPlugin =>
	({
		id: "harmony-email",
		init() {
			// eslint-disable-next-line @typescript-eslint/require-await,unicorn/consistent-function-scoping -- better-auth types
			const normalize = async (
				user: Partial<User> & { phoneNumber?: string },
			) => {
				const { email, phoneNumber } = user;
				if (!email || phoneNumber) return { data: user as Required<User> };

				const normalizedEmail = normalizer(email);
				/* v8 ignore next */
				if (!normalizedEmail) return false;

				return {
					data: {
						...(user as Required<User>),
						normalizedEmail,
					},
				};
			};

			return {
				options: {
					databaseHooks: {
						user: {
							create: {
								before: normalize,
							},
							update: {
								before: normalize,
							},
						},
					},
				},
			};
		},
		schema: {
			user: {
				fields: {
					normalizedEmail: {
						type: "string",
						required: false,
						unique: true,
						input: false,
						returned: false,
					},
				},
			},
		},
		hooks: {
			before: [
				{
					matcher: (context) =>
						matchers.validation
							? matchers.validation.some((matcher) => matcher(context))
							: allEmail(context),
					handler: createAuthMiddleware(async (ctx) => {
						const email =
							ctx.path === "/change-email"
								? (ctx.body as Context["body"])?.newEmail
								: getEmail(ctx).email;

						if (typeof email !== "string") return;

						const isValid = await validator(email);
						if (!isValid)
							throw new APIError("BAD_REQUEST", { message: "Invalid email" });
					}),
				},
				{
					matcher: (context) =>
						allowNormalizedSignin &&
						(matchers.signIn
							? matchers.signIn.some((matcher) => matcher(context))
							: allEmailSignIn(context)),
					handler: createAuthMiddleware(async (ctx) => {
						const { email, container } = getEmail(ctx);

						if (typeof email !== "string") return;

						const normalizedEmail = normalizer(email);

						if (normalizedEmail !== email) {
							const user =
								await ctx.context.adapter.findOne<UserWithNormalizedEmail>({
									model: "user",
									where: [
										{
											field: "normalizedEmail",
											value: normalizedEmail,
										},
									],
								});

							if (!user) return;

							// Types are broken without explicit reference
							return container === "query"
								? {
										context: {
											...ctx,
											query: {
												...ctx.query,
												email: user.email,
												normalizedEmail,
											},
										},
									}
								: {
										context: {
											...ctx,
											body: {
												...(ctx.body as Context["body"]),
												email: user.email,
												normalizedEmail,
											},
										},
									};
						}
					}),
				},
			],
		},
	}) satisfies BetterAuthPlugin;

export default emailHarmony;
