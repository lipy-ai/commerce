import { env } from "@envClient";
import type { AuthType } from "@lipy/server/types";
import {
	emailOTPClient,
	inferAdditionalFields,
	organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: env.API_URL,
	plugins: [
		inferAdditionalFields<AuthType>(),
		organizationClient(),
		emailOTPClient(),
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
	type: "google" | "microsoft" | "otp" | "signin-otp",
	opts?: { email?: string; callbackURL?: string; otp?: string },
	routeCb?: (v: string) => void,
) => {
	const callbackURL = opts?.callbackURL || window.location.origin;
	switch (type) {
		case "otp":
			return await authClient.emailOtp
				.sendVerificationOtp({
					email: opts!.email!,
					type: "sign-in",
					// callbackURL: opts!.callbackURL,
				})
				.then((r) => {
					if (r.data?.success === false) {
						throw new Error("Failed to send login OTP");
					}
					return true;
				})
				.catch((e) => {
					throw e;
				});
		case "signin-otp":
			return await authClient.signIn
				.emailOtp({
					email: opts?.email!,
					otp: opts?.otp!,
				})
				.then((r) => {
					// console.log({ r });
					if (!r.data?.user) {
						throw new Error("Failed to signin");
					}
					routeCb?.(callbackURL);
					return;
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
