import env from "@/env";
import { SES } from "@aws-sdk/client-ses";
import type { SendEmailCommandInput } from "@aws-sdk/client-ses";

const ses = new SES({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY,
		secretAccessKey: env.AWS_SECRET_KEY,
	},
});

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
