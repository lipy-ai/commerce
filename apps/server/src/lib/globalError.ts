import env from "@/env";
import type { ErrorResponse, ServerContext } from "@/types";
import type { ErrorHandler } from "hono";
import { ERR_CODES_MSGS, HTTPError } from "./exception";

export const globalError: ErrorHandler<ServerContext> = (err, c) => {
	console.log(err);
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
