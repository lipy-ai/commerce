import env from "@/env";
import { SES } from "@aws-sdk/client-ses";
import type { SendEmailCommandInput } from "@aws-sdk/client-ses";
import { Resend } from "resend";

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
	return await fetch("https://api.useplunk.com/v1/send", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${env.PLUNK_SECRET_KEY}`,
		},
		body: JSON.stringify({ ...body, reply: env.REPLY_EMAIL }),
	}).then(async (r) => {
		if (r.ok) return await r.json();
		throw new Error("Failed to send email!");
	});
};

export const sendTransactionalEmail = async (props: {
	subject: string;
	html: string;
	to: string[];
}) => {
	const params: SendEmailCommandInput = {
		Source: env.TRANSACTIONAL_EMAIL,
		Destination: {
			ToAddresses: props.to,
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

const resend = new Resend(env.RESEND_API_KEY);

export const sendResendEmail = async (props: {
	subject: string;
	html: string;
	to: string[];
}) => {
	const { data, error } = await resend.emails.send({
		from: "Lipy <rishabhraj.891@gmail.com>",
		...props,
	});
};
