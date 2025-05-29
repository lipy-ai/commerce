import env from "@/env";
import {
	SNSClient,
	PublishCommand,
	type PublishCommandInput,
} from "@aws-sdk/client-sns";

const sns = new SNSClient({
	region: env.AWS_SES_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY,
		secretAccessKey: env.AWS_SECRET_KEY,
	},
});

async function sendMessage(params: PublishCommandInput) {
	const command = new PublishCommand(params);
	const message = await sns.send(command);
	return message;
}

export const sendSMS = async (props: {
	message: string;
	phoneNumber: string;
}) => {
	const params: PublishCommandInput = {
		Message: props.message,
		PhoneNumber: props.phoneNumber,
		MessageAttributes: {
			"AWS.SNS.SMS.SenderID": {
				DataType: "String",
				StringValue: "String",
			},
		},
	};
	await sendMessage(params);
};
