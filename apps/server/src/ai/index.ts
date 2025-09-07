import { Groq } from "groq-sdk";
import env from "@/env";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export const getGroqChatStream = async ({
	messages,
}: {
	messages: Groq.Chat.Completions.ChatCompletionMessageParam[];
}) => {
	return groq.chat.completions.create(
		{
			messages,
			model: "llama-3.1-8b-instant", //'llama3-70b-8192',
			temperature: 0.5,
			top_p: 1,
			stop: null,
			stream: false,
		},
		{ timeout: 10000 },
	);
};
