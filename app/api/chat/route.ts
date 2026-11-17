
import { google } from "@ai-sdk/google";
import {
    convertToModelMessages,
    streamText,
    type UIMessage,
} from "ai";

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } =
        await req.json();


    // 最新のユーザーメッセージを取得する
    const latestMessage = messages[messages.length - 1];

    // メッセージのテキスト部分を取り出す
    const latestText = latestMessage?.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("") ?? "";

    // 最新メッセージが長すぎる場合は拒否する
    if (latestText.length > 1000) {
        return new Response(
            "メッセージは1000文字以内で入力してください。",
            { status: 400 }
        );
    }


    const result = streamText({
        model: google("gemini-3-flash-preview"),
        system: "あなたは親切なAIアシスタントです。日本語でわかりやすく回答してください。",
        messages: await convertToModelMessages(messages.slice(-10)),
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
