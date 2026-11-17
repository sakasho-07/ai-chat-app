
"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function Home() {
  const [input, setInput] = useState("");


  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    experimental_throttle: 50,
  });


  const handleSend = () => {
    if (input.trim() === "" || status !== "ready") return;

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

          {status === "submitted" && (
            <p className="text-gray-400">AIが考えています...</p>
          )}


          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-800 bg-red-950 p-3 text-red-200"
            >
              <p className="font-semibold">
                AIから回答を取得できませんでした
              </p>
              <p className="mt-1 text-sm">
                通信状況やAPIの利用制限を確認し、
                少し時間をおいて再度お試しください。
              </p>
            </div>
          )}

        </div>

        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
            className="flex-1 resize-none rounded-lg bg-gray-800 p-3 outline-none"
          />

          <button
            onClick={handleSend}
            disabled={status !== "ready"}
            className="rounded-lg bg-blue-600 px-5 py-3 disabled:opacity-50"
          >
            送信
          </button>
        </div>
      </div>
    </main>
  );
}
