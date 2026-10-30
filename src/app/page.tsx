"use client";

import { useState } from "react";
import AssistantFace from "@/components/assistant-face";
import ChatPanel from "@/components/chat-panel";
import LoginModal from "@/components/login-modal";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="flex h-dvh flex-col bg-zinc-50 font-sans dark:bg-black">
      <header className="flex justify-end p-4">
        <button
          onClick={() => setIsLoginOpen(true)}
          className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
        >
          Entrar
        </button>
      </header>
      <main className="flex flex-1 flex-col items-center gap-6 overflow-hidden px-4 pb-6">
        <AssistantFace />
        <h1 className="text-center text-xl font-semibold sm:text-2xl">Como posso ajudar?</h1>
        <ChatPanel />
      </main>
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
}
