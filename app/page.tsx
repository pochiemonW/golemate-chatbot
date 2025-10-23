"use client";

import { useState } from "react";
import { TodoData, generateMarkdown, downloadMarkdown } from "./utils/todo-generator";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [todoData, setTodoData] = useState<TodoData | null>(null);

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
      
      // Todoデータが含まれているかチェック
      if (data.todoData) {
        setTodoData(data.todoData);
      } else {
        // メッセージ内容からJSONデータを抽出
        const messageContent = data.message.content;
        if (messageContent) {
          const jsonMatch = messageContent.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch) {
            try {
              const extractedTodoData = JSON.parse(jsonMatch[1]);
              setTodoData(extractedTodoData);
            } catch (e) {
              console.error('JSON parse error:', e);
            }
          }
        }
      }
    }
  };

  const handleDownloadTodo = () => {
    if (todoData) {
      const markdown = generateMarkdown(todoData);
      downloadMarkdown(markdown, `todo-list-${new Date().toISOString().split('T')[0]}.md`);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">あなたと一緒に目標を立ててくれるチャットボット（仮）</h1>

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
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              e.preventDefault();
              void sendMessage();
            }
          }}
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
      
      {todoData && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 mb-2">✅ Todoリストが完成しました！</p>
          <button
            onClick={handleDownloadTodo}
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
          >
            📥 Todoをダウンロード
          </button>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">ヒント: Ctrl + Enter で送信できます</p>
    </main>
  );
}


