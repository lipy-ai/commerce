import env from "@/env";
import { HTTPError } from "@/lib/exception";
import { SES } from "@aws-sdk/client-ses";
import type { SendEmailCommandInput } from "@aws-sdk/client-ses";

const ses = new SES({
	region: env.AWS_SES_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY,
		secretAccessKey: env.AWS_SECRET_KEY,
	},
});

export const plunkSendEmail = async (body: {
	to: string;
	subject: string;
	body: string;
}) => {
	try {
		const res = await fetch("https://api.useplunk.com/v1/send", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${env.PLUNK_SECRET_KEY}`,
			},
			body: JSON.stringify({
				...body,
				reply: env.REPLY_EMAIL,
			}),
		});

		if (!res.ok) {
			const errorText = await res.text();
			throw new HTTPError(res.status, {
				message: "Failed to send email!",
				cause: errorText,
			});
		}

		return await res.json();
	} catch (err) {
		if (err instanceof HTTPError) throw err;
		throw new HTTPError(400, {
			message: "Email request failed unexpectedly.",
			cause: err,
		});
	}
};

export const resendSendEmail = async (body: {
	to: string;
	subject: string;
	body: string;
}) => {
	try {
		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${env.RESEND_SECRET_KEY}`,
			},
			body: JSON.stringify({
				...body,
				html: body.body,
				from: env.REPLY_EMAIL,
				reply_to: env.REPLY_EMAIL,
			}),
		});

		if (!res.ok) {
			const errorText = await res.text();
			throw new HTTPError(res.status, {
				message: "Failed to send email!",
				cause: errorText,
			});
		}

		return await res.json();
	} catch (err) {
		if (err instanceof HTTPError) throw err;
		throw new HTTPError(400, {
			message: "Email request failed unexpectedly.",
			cause: err,
		});
	}
};

export const awsSendEmail = async (props: {
	subject: string;
	html: string;
	to: string;
}) => {
	const params: SendEmailCommandInput = {
		Source: env.TRANSACTIONAL_EMAIL,
		Destination: {
			ToAddresses: [props.to],
		},
		Message: {
			Body: {
				Html: {
					Charset: "UTF-8",
					Data: props.html,
				},
			},
			Subject: {
				Charset: "UTF-8",
				Data: props.subject,
			},
		},
	};

	return await ses.sendEmail(params);
};

export const sendTransactionalEmail = async (body: {
	to: string;
	subject: string;
	body: string;
}) => {
	return await resendSendEmail(body);
};
