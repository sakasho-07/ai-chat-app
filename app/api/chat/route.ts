
import { google } from "@ai-sdk/google";
import {
    convertToModelMessages,
    streamText,
    type UIMessage,
} from "ai";

export async function POST(req: Request) {

    const { messages }: { messages: UIMessage[] } =
        await req.json();


    const result = streamText({
        model: google("gemini-3-flash-preview"),
        system: "あなたは親切なAIアシスタントです。日本語でわかりやすく回答してください。",
        messages: await convertToModelMessages(messages),
        maxOutputTokens: 2000,

        onFinish: ({ finishReason, usage }) => {
            console.log("AI終了理由:", finishReason);
            console.log("トークン使用量:", usage);
        },

        onError: ({ error }) => {
            console.error("AI生成エラー:", error);
        },
    });


    return result.toUIMessageStreamResponse();
}
