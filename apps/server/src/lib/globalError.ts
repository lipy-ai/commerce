import type { ErrorHandler } from "hono";
import { PostHog } from "posthog-node";
import env from "@/env";
import type { ErrorResponse, ServerContext } from "@/types";
import { ERR_CODES_MSGS, HTTPError } from "./exception";

export const globalError: ErrorHandler<ServerContext> = (err, c) => {
	if (err instanceof HTTPError) {
		const errResponse = c.json<ErrorResponse>(
			{
				success: false,
				error: {
					code: err?.code || undefined,
					message: err.message || (err?.code ? ERR_CODES_MSGS[err.code!] : ""),
					cause: env.IN_PROD ? undefined : err.cause || err.stack,
				},
			},
			err.status as any,
		);
		return errResponse;
	}

	if (env.IN_PROD) {
		const posthog = new PostHog(env.VITE_POSTHOG_PUBLIC_KEY, {
			host: env.VITE_POSTHOG_HOST,
		});

		posthog.captureException(
			new Error(
				err.message ||
					((err as any)?.code
						? ERR_CODES_MSGS[(err as any)?.code as keyof typeof ERR_CODES_MSGS]
						: ""),
				{ cause: err },
			),
			"backend_err",
			{
				path: c.req.path,
				method: c.req.method,
				url: c.req.url,
				headers: JSON.stringify(c.req.header()),
				variables: JSON.stringify(c.var),
			},
		);
		posthog.shutdown();
		console.log(err);
	} else {
		console.log(err);
	}

	return c.json<ErrorResponse>(
		{
			success: false,
			error: {
				message: env.IN_PROD ? "Internal Server Error" : err.message,
				cause: env.IN_PROD ? undefined : err.cause || err.stack,
			},
		},
		500,
	);
};
