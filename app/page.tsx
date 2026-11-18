
"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function Home() {
  const [input, setInput] = useState("");
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, clearError, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",

      fetch: async (input, init) => {
        const response = await fetch(input, init);

        if (!response.ok) {
          console.log("HTTPエラー:", response.status);
          setErrorStatus(response.status);
        } else {
          setErrorStatus(null);
        }

        return response;
      },
    }),
    experimental_throttle: 50,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, status]);

  const handleSend = () => {
    if (
      input.trim() === "" ||
      status === "submitted" ||
      status === "streaming"
    ) return;

    setErrorStatus(null);
    clearError();

    sendMessage({ text: input });
    setInput("");
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-950 text-white">
      <header className="border-b border-gray-800 p-5 text-center">
        <h1 className="text-xl font-bold">AI Chat</h1>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col p-5">
        <div className="flex-1 space-y-3 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`w-fit max-w-[80%] rounded-lg p-3 ${message.role === "user"
                ? "ml-auto bg-blue-600"
                : "mr-auto bg-gray-800"
                }`}
            >
              {message.parts.map((part, index) =>
                part.type === "text" ? (
                  <span key={index} className="whitespace-pre-wrap">
                    {part.text}
                  </span>
                ) : null
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />

          {status === "submitted" && (
            <p className="text-gray-400">AIが考えています...</p>
          )}


          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-800 bg-red-950 p-3 text-red-200"
            >
              <p className="font-semibold">
                {errorStatus === 400
                  ? "メッセージは1000文字以内で入力してください。"
                  : errorStatus === 429
                    ? "送信回数の制限に達しました。少し時間をおいて再度お試しください。"
                    : errorStatus === 500
                      ? "AIサービスでエラーが発生しました。設定や接続状況を確認してください。"
                      : "AIから回答を取得できませんでした。時間をおいて再度お試しください。"}
              </p>
            </div>
          )}

        </div>

        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="メッセージを入力..."
              rows={2}
              className="resize-none rounded-lg bg-gray-800 p-3 outline-none"
            />

            <p className="text-right text-sm text-gray-400">
              {input.length} / 1000文字
            </p>
          </div>


          {status === "submitted" || status === "streaming" ? (
            <button
              onClick={() => stop()}
              className="rounded-lg bg-red-600 px-5 py-3"
            >
              停止
            </button>
          ) : (
            <button
              onClick={handleSend}
              className="rounded-lg bg-blue-600 px-5 py-3"
            >
              送信
            </button>
          )}

        </div>
      </div>
    </main>
  );
}
