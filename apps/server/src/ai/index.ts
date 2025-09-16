import vision from "@google-cloud/vision";
import { Groq } from "groq-sdk";
import env from "@/env";

export const getGroqChatStream = async ({
  messages,
}: {
  messages: Groq.Chat.Completions.ChatCompletionMessageParam[];
}) => {
  const groq = new Groq({ apiKey: env.GROQ_API_KEY });

  return groq.chat.completions.create(
    {
      messages,
      model: "llama-3.1-8b-instant", //'llama3-70b-8192',
      temperature: 0.5,
      top_p: 1,
      stop: null,
      stream: false,
    },
    { timeout: 10000 }
  );
};

export const googleVisionClient = new vision.ImageAnnotatorClient({
  credentials: env.GOOGLE_VISION_KEY && JSON.parse(env.GOOGLE_VISION_KEY),
});
