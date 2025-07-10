export interface HTTPExceptionOptions {
	code?: ErrCode;
	message?: string;
	cause?: unknown;
	res?: Response;
}

export class HTTPError extends Error {
	res?: Response;
	status: number;
	code?: ErrCode;

	constructor(status = 500, options: HTTPExceptionOptions = {}) {
		super(options?.message, { cause: options?.cause });
		this.res = options?.res;
		this.status = status;
		this.code = options?.code;
	}

	getResponse(): Response {
		if (this.res) {
			const newResponse = new Response(this.res.body, {
				status: this.status,
				headers: this.res.headers,
			});
			return newResponse;
		}

		return new Response(
			JSON.stringify({
				code: this.code ?? "UNKNOWN_ERROR",
				message: this.message,
			}),
			{
				status: this.status,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}

export const ERR_CODES_MSGS = {
	NO_ACTIVE_STORE: "No active store found!",
	NOT_LOGGED_IN: "No active session found!",
	INSUFFICIENT_PERMISSION: "Insufficient permission!",
	VALIDATION_ERR: "Validation error!",
} as const;

export type ErrCode = keyof typeof ERR_CODES_MSGS;

export const ERR_CODES = Object.keys(ERR_CODES_MSGS).reduce(
	(acc, key) => {
		acc[key as ErrCode] = key as ErrCode;
		return acc;
	},
	{} as Record<ErrCode, ErrCode>,
);
