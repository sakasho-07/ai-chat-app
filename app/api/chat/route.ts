
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import {
    isValidMessageLength,
    getRecentMessages,
} from "@/app/lib/validate";

import {
    convertToModelMessages,
    streamText,
    type UIMessage,
} from "ai";

export async function POST(req: Request) {
    const provider = process.env.AI_PROVIDER ?? "google";

    const apiKey =
        provider === "anthropic"
            ? process.env.ANTHROPIC_API_KEY
            : process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
        console.error("AI APIキーが設定されていません。");

        return new Response(
            "AIサービスの設定が不足しています。",
            { status: 500 }
        );
    }

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
    if (!isValidMessageLength(latestText)) {
        return new Response(
            "メッセージは1000文字以内で入力してください。",
            { status: 400 }
        );
    }


    const result = streamText({
        model:
            process.env.AI_PROVIDER === "anthropic"
                ? anthropic("claude-haiku-4-5")
                : google("gemini-3-flash-preview"),
        system: "あなたは親切なAIアシスタントです。日本語でわかりやすく回答してください。",
        messages: await convertToModelMessages(getRecentMessages(messages)),
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
