import { env } from "@envClient";

import type { AuthType } from "@lipy/server/types";
import {
	emailOTPClient,
	inferAdditionalFields,
	phoneNumberClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: env.API_URL,
	plugins: [
		inferAdditionalFields<AuthType>(),
		emailOTPClient(),
		phoneNumberClient(),
	],
});

export const getSsrSession = async (headers?: Headers) => {
	return await fetch(`${env.AUTH_URL}/api/auth/get-session`, {
		headers,
	}).then(async (r) => {
		const json = await r.json();
		if (!r.ok) {
			throw json;
		}
		return json;
	});
};

export const signIn = async (
	type:
		| "google"
		| "microsoft"
		| "verify-otp"
		| "send-otp"
		| "email-otp"
		| "verify-email-otp",
	opts?: {
		phoneNumber?: string;
		callbackURL?: string;
		otp?: string;
		email?: string;
	},
	routeCb?: (v: string) => void,
) => {
	const callbackURL = opts?.callbackURL || window.location.origin;
	switch (type) {
		case "email-otp":
			return await authClient.emailOtp
				.sendVerificationOtp({
					email: opts!.email!,
					type: "sign-in",
				})
				.then((r) => {
					if (r.data?.success === false) {
						throw new Error("Failed to send login OTP");
					}
				})
				.catch((e) => {
					throw e;
				});
		case "verify-email-otp":
			return await authClient.signIn
				.emailOtp({
					email: opts!.email!,
					otp: opts?.otp!,
				})
				.then((r) => {
					if (!r.data?.user) {
						throw new Error("Failed to signin");
					}
					return routeCb?.(callbackURL);
				})
				.catch((e) => {
					throw e;
				});
		case "send-otp":
			return await authClient.phoneNumber
				.sendOtp({
					phoneNumber: opts?.phoneNumber!,
				})
				.then((r) => {
					if (!r.data?.message) {
						throw new Error("Failed to signin");
					}
					return true;
				})
				.catch((e) => {
					throw e;
				});
		case "verify-otp":
			return await authClient.phoneNumber
				.verify({
					phoneNumber: opts!.phoneNumber!,
					code: opts?.otp!,
				})
				.then((r) => {
					if (r.data?.status === false) {
						throw new Error("Failed to send login OTP");
					}

					return routeCb?.(callbackURL);
				})
				.catch((e) => {
					throw e;
				});

		case "google":
			return await authClient.signIn
				.social({
					provider: "google",
					callbackURL: callbackURL,
				})
				.then((_r) => true)
				.catch((e) => {
					throw e;
				});

		case "microsoft":
			return await authClient.signIn
				.social({
					provider: "microsoft",
					callbackURL: callbackURL,
				})
				.then((_r) => true)
				.catch((e) => {
					throw e;
				});

		default:
			throw new Error("Invalid signin action");
	}
};
