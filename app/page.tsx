"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.message) {
      setMessages([...newMessages, data.message]);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🎯 Chat with AI</h1>

      <div className="flex-1 overflow-y-auto border rounded-lg p-3 mb-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg ${
              m.role === "user" ? "bg-blue-100 self-end" : "bg-gray-100"
            }`}
          >
            <p>
              <strong>{m.role === "user" ? "あなた：" : "AI："}</strong> {m.content}
            </p>
          </div>
        ))}
        {loading && <p className="text-gray-500">AIが考え中...</p>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-lg p-2"
          placeholder="メッセージを入力..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          送信
        </button>
      </div>
    </main>
  );
}


