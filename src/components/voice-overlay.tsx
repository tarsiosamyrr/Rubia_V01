"use client";

import { useEffect } from "react";
import AssistantFace from "@/components/assistant-face";
import { ChatBubbleIcon, CloseIcon, MicIcon } from "@/components/chat-icons";
import type { AssistantState } from "@/hooks/use-voice-assistant";

const STATUS_LABEL: Record<AssistantState, string> = {
  idle: "Pronta para ouvir",
  listening: "Ouvindo…",
  thinking: "Pensando…",
  speaking: "Falando…",
};

// Bar heights measured from the Figma "Floating Oxy / Listening" waveform (node 40:1285).
const WAVE_HEIGHTS = [10, 18, 28, 14, 34, 22, 12, 28, 16, 8];

// Full-screen voice mode, matching the Figma "Floating Oxy" tray (node 40:1386): status
// pill, waveform while listening/speaking, and Chat/Close controls to return to text chat.
// shortcut: the mic indicator is decorative (reflects state, doesn't mute) — the hook
// behind it listens continuously and has no external stop/mute control yet.
export default function VoiceOverlay({ state, onClose }: { state: AssistantState; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-6">
        <AssistantFace size={220} interactive={false} state={state} />
        <div className="flex flex-col items-center gap-4 rounded-[28px] border border-line bg-panel p-4 shadow-xl">
          <div className="flex items-center gap-2 rounded-full bg-panel-muted px-4 py-2">
            <span className={`size-2 rounded-full ${state === "idle" ? "bg-muted" : "bg-[#681ce3]"}`} />
            <span className="text-[15px] font-medium tracking-[-0.1px]">{STATUS_LABEL[state]}</span>
          </div>
          {(state === "listening" || state === "speaking") && (
            <div className="flex h-[34px] items-end gap-[3px]">
              {WAVE_HEIGHTS.map((h, i) => (
                <span
                  key={i}
                  className="w-1 animate-pulse rounded-sm bg-[#ac80fa]"
                  style={{ height: h, animationDelay: `${i * 90}ms` }}
                />
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex size-11 items-center justify-center rounded-full bg-[#681ce3] text-white">
              <MicIcon className="size-5" />
            </div>
            <button
              onClick={onClose}
              aria-label="Voltar para o chat"
              className="flex size-11 items-center justify-center rounded-full border border-line bg-panel-muted text-foreground transition-colors hover:bg-panel"
            >
              <ChatBubbleIcon className="size-5" />
            </button>
            <button
              onClick={onClose}
              aria-label="Fechar modo voz"
              className="flex size-11 items-center justify-center rounded-full border border-line bg-panel-muted text-foreground transition-colors hover:bg-panel"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
