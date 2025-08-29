import twilio from "twilio";
import env from "@/env";

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export async function createCall() {
	const call = await client.calls.create({
		from: "+15558675310",
		to: "+919325029116",
		url: "http://demo.twilio.com/docs/voice.xml",
	});

	console.log(call.sid);
	return call;
}
