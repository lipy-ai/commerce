import type { HookEndpointContext } from "better-auth";
import { APIError } from "better-auth/api";
import { createAuthMiddleware } from "better-auth/plugins";
import {
  type CountryCode,
  type E164Number,
  ParseError,
  parsePhoneNumberWithError,
} from "libphonenumber-js/max";
import type { BetterAuthPlugin } from "better-auth/types";

export type Matcher = (context: HookEndpointContext) => boolean;

const phonePaths = new Set([
  "/sign-in/phone-number",
  "/phone-number/forget-password",
  "/phone-number/reset-password",
  "/phone-number/send-otp",
  "/phone-number/verify",
]);

/**
 * Path is one of `['/sign-in/phone-number', '/phone-number/forget-password',
 * '/phone-number/reset-password', '/phone-number/send-otp', '/phone-number/verify']`.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const allPhone: Matcher = ({ path }) => phonePaths.has(path);

/**
 * Path is `'/sign-in/phone-number'`.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const signInPhone: Matcher = ({ path }) =>
  path === "/sign-in/phone-number";

/**
 * Path is `'/phone-number/send-otp'`.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const phoneOtp: Matcher = ({ path }) =>
  path === "/phone-number/send-otp";

/**
 * Path is `'/phone-number/verify'`.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const phoneVerify: Matcher = ({ path }) =>
  path === "/phone-number/verify";

/**
 * Path is `'/phone-number/forget-password'`.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const phoneForget: Matcher = ({ path }) =>
  path === "/phone-number/forget-password";

/**
 * Path is `'/phone-number/reset-password'`.
 * @param context Request context
 * @param context.path Request path
 * @returns boolean
 */
export const phoneReset: Matcher = ({ path }) =>
  path === "/phone-number/reset-password";
interface Context {
  body: Record<string, unknown>;
  query?: Record<string, unknown>;
}

interface NormalizationOptions {
  /**
   * Default [country](https://www.npmjs.com/package/libphonenumber-js#country-code)
   * for parsing numbers written in non-international form (without a `+` sign). Will be ignored
   * when parsing numbers written in international form
   * (with a `+` sign).
   */
  defaultCountry?: CountryCode;
  /**
   * Default calling code for parsing numbers written in
   * non-international form (without a `+` sign). Will be ignored when parsing numbers written in
   * international form (with a `+` sign). It could be specified when parsing phone numbers
   * belonging to ["non-geographic numbering
   * plans"](https://www.npmjs.com/package/libphonenumber-js#non-geographic) which by nature don't
   * have a country code, making the `defaultCountry` option unusable.
   */
  defaultCallingCode?: string;
  /**
   * Defines the
   * ["strictness"](https://www.npmjs.com/package/libphonenumber-js#strictness) of parsing a phone
   * number. By default, the extract flag is `true` meaning that it will attempt to extract the
   * phone number from an input string like `"My phone number is (213) 373-4253 and my hair is
   * blue"`. This could be thought of as
   * "less strict" parsing. To make it "more strict", one could pass `extract: false` flag, in which
   * case the function will attempt to parse the input string as if the whole string was a phone
   * number. Applied to the example above, it would return `undefined` because the entire string is
   * not a phone number, but for input string `"(213) 373-4253"` it would return a parsed
   * `PhoneNumber`.
   * @default true
   */
  extract?: boolean;
}

/**
 * @see https://www.npmjs.com/package/libphonenumber-js#api
 * @returns The phone number in E.164 format. Example: `"+12133734253"`. Returns `undefined` if no
 *   phone number could be parsed: for example, when the string contains no phone number, or the
 *   phone number starts with a non-existent country calling code, etc.
 */
export type NormalizePhoneNumber = (
  phone: string,
  request?: HookEndpointContext["request"]
) => Promise<E164Number> | E164Number;

export interface PhoneHarmonyOptions extends NormalizationOptions {
  /**
   * If the normalizer throws, for example because it is unable to parse the phone number, use the
   * original input. For example, the phone number `"+12"` will be saved as-is to the database.
   * @default false
   */
  acceptRawInputOnError?: boolean;
  /**
   * Function to normalize phone number. Default uses `parsePhoneNumberWithError` from
   * `libphonenumber-js/max`.
   * Can be used to infer the country through the Request object, for example using IP address
   * geolocation.
   * @see https://www.npmjs.com/package/libphonenumber-js#user-content-parse-phone-number
   */
  normalizer?: NormalizePhoneNumber;
  /**
   * Specify in which routes the plugin should run, for example by path.
   * @example <caption>Ready-made matchers</caption>
   * import * as matchers from 'better-auth-harmony/phone/matchers';
   *
   * export const auth = betterAuth({
   *   // ... other config options
   *   plugins: [
   *     phoneNumber(),
   *     phoneHarmony({ matchers: [matchers.signInPhone, matchers.phoneOtp]})
   *   ]
   * });
   * @default [`allPhone`]
   */
  matchers?: Matcher[];
}

const phoneHarmony = ({
  defaultCountry,
  defaultCallingCode,
  extract = true,
  acceptRawInputOnError = false,
  matchers = [allPhone],
  normalizer,
}: PhoneHarmonyOptions = {}): BetterAuthPlugin =>
  ({
    id: "harmony-phone-number",
    hooks: {
      before: [
        {
          matcher: (context) => matchers.some((matcher) => matcher(context)),
          handler: createAuthMiddleware(async (ctx) => {
            // Replace context number with the value of `normalizedPhone`
            const { phoneNumber } = ctx.body as Context["body"];

            if (typeof phoneNumber !== "string") return;

            let normalize = normalizer;
            if (!normalize) {
              normalize = (text: string) =>
                parsePhoneNumberWithError(text, {
                  defaultCountry,
                  defaultCallingCode,
                  extract,
                }).number;
            }

            let normalizedPhone = phoneNumber;

            try {
              normalizedPhone = await normalize(phoneNumber, ctx.request);
            } catch (error) {
              if (!acceptRawInputOnError && error instanceof ParseError) {
                throw new APIError("BAD_REQUEST", { message: error.message });
              }
              if (!acceptRawInputOnError) {
                throw error;
              }
              normalizedPhone = phoneNumber; // fall back to the raw input
            }

            return {
              context: {
                ...ctx,
                body: {
                  ...(ctx.body as Context["body"]),
                  phoneNumber: normalizedPhone,
                },
              },
            };
          }),
        },
      ],
    },
  }) satisfies BetterAuthPlugin;

export default phoneHarmony;
