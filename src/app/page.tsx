"use client";

import { useState } from "react";
import AssistantFace from "@/components/assistant-face";
import LoginModal from "@/components/login-modal";
import ThemeToggle from "@/components/theme-toggle";
import { useVoiceAssistant, type AssistantState } from "@/hooks/use-voice-assistant";

const SUBTITLE_BY_STATE: Record<AssistantState, string> = {
  idle: "Pergunte o que precisar, estou aqui para ajudar.",
  listening: "Estou ouvindo...",
  thinking: "Pensando...",
  speaking: "Respondendo...",
};

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { state } = useVoiceAssistant();

  return (
    <div className="flex h-dvh flex-col bg-background font-sans text-foreground">
      <header className="flex items-center justify-between px-6 py-4 sm:px-10">
        <div className="flex items-center gap-3">
          <AssistantFace size={36} interactive={false} />
          <span className="font-semibold">Oxy</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsLoginOpen(true)}
            className="rounded-full border border-line px-5 py-2 text-sm font-medium transition-colors hover:bg-panel-muted"
          >
            Entrar
          </button>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-4 pb-10">
        <AssistantFace size={176} state={state} />
        <div className="text-center">
          <h1 className="text-2xl font-semibold sm:text-3xl">Como posso ajudar?</h1>
          <p className="mt-2 text-sm text-muted sm:text-base">{SUBTITLE_BY_STATE[state]}</p>
        </div>
      </main>
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
}
