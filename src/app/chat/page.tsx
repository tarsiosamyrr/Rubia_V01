"use client";

import { useEffect, useRef, useState } from "react";
import AssistantFace from "@/components/assistant-face";
import ChatComposer from "@/components/chat-composer";
import ChatMessage, { type ChatMessageData } from "@/components/chat-message";
import ChatTypingIndicator from "@/components/chat-typing-indicator";
import ThemeToggle from "@/components/theme-toggle";
import VoiceOverlay from "@/components/voice-overlay";
import { MOCK_REPLIES, useVoiceAssistant } from "@/hooks/use-voice-assistant";

// Matches the Figma "Chat / Boas-vindas" suggestion chips (node 42:47).
const SUGGESTIONS = ["Eventos desta semana", "Programas e cursos", "Prazo de matrícula", "Falar com a equipe"];

export default function ChatPage() {
  const { state } = useVoiceAssistant();
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const nextId = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    setMessages((prev) => [...prev, { id: nextId.current++, role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);
    window.setTimeout(() => {
      const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)](trimmed);
      setMessages((prev) => [...prev, { id: nextId.current++, role: "assistant", text: reply }]);
      setIsTyping(false);
    }, 900);
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-dvh flex-col bg-background font-sans text-foreground">
      <header className="flex h-[72px] shrink-0 items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-2">
          <AssistantFace size={36} interactive={false} />
          <span className="font-semibold tracking-[-0.2px]">Rubia</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            title="Em breve"
            aria-disabled="true"
            className="cursor-default rounded-full px-5 py-3 text-[15px] font-medium text-muted opacity-70"
          >
            Histórico
          </button>
          <button
            onClick={() => setVoiceMode(true)}
            className="rounded-full border border-line px-5 py-3 text-[15px] font-medium transition-colors hover:bg-panel-muted"
          >
            Modo voz
          </button>
        </div>
      </header>

      {hasMessages ? (
        <div className="flex flex-1 flex-col items-center gap-5 overflow-hidden px-4 pb-8 pt-2">
          <div className="flex w-full max-w-[760px] flex-1 flex-col gap-4 overflow-y-auto">
            {messages.map((m) => (
              <ChatMessage key={m.id} role={m.role} text={m.text} />
            ))}
            {isTyping && <ChatTypingIndicator />}
            <div ref={bottomRef} />
          </div>
          <ChatComposer
            value={input}
            onChange={setInput}
            onSubmit={() => sendMessage(input)}
            onVoiceClick={() => setVoiceMode(true)}
            className="w-full max-w-[760px]"
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 pb-10">
          <AssistantFace size={220} state={state} />
          <div className="text-center">
            <h1 className="text-[32px] font-bold tracking-[-0.8px] sm:text-[48px]">Como posso ajudar?</h1>
            <p className="mt-1 text-[16px] tracking-[-0.2px] text-muted sm:text-[17px]">
              Pergunte sobre eventos, programas e serviços do Hub.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="rounded-full border border-line bg-panel-muted px-4 py-2 text-[15px] font-medium tracking-[-0.1px] hover:border-muted"
              >
                {s}
              </button>
            ))}
          </div>
          <ChatComposer
            value={input}
            onChange={setInput}
            onSubmit={() => sendMessage(input)}
            onVoiceClick={() => setVoiceMode(true)}
            className="w-[720px] max-w-full"
          />
          <p className="text-[13px] text-muted">A Rubia pode errar. Confira informações importantes nos canais oficiais.</p>
        </div>
      )}

      {voiceMode && <VoiceOverlay state={state} onClose={() => setVoiceMode(false)} />}
    </div>
  );
}
