"use client";

import { useRef, useState } from "react";

type Message = { id: number; text: string };

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const nextId = useRef(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: nextId.current++, text }]);
    setInput("");
  }

  return (
    <div className="flex w-full max-w-2xl flex-1 flex-col rounded-2xl border border-black/10 bg-white/80 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">Diga algo para começar a conversa.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="ml-auto max-w-[80%] rounded-2xl bg-indigo-600 px-4 py-2 text-white">
              {m.text}
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-black/10 p-3 dark:border-white/10">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escreva sua mensagem..."
          className="flex-1 rounded-full border border-black/10 bg-transparent px-4 py-2 outline-none focus:border-indigo-500 dark:border-white/10"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="rounded-full bg-indigo-600 px-5 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
