"use client";

import { MicIcon, SendIcon } from "@/components/chat-icons";

// Matches the Figma "Composer" component (node 25:148): pill field, mic button, send
// button. shortcut: no inline "Recording" waveform state — the mic button opens the
// full voice overlay instead of transcribing inline.
export default function ChatComposer({
  value,
  onChange,
  onSubmit,
  onVoiceClick,
  placeholder = "Pergunte à Rubia…",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onVoiceClick: () => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit();
      }}
      className={`flex h-[60px] items-center gap-2 rounded-full border border-line bg-panel-muted pr-2.5 pl-5 backdrop-blur-[15px] ${className}`}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[17px] tracking-[-0.2px] text-foreground outline-none placeholder:text-muted"
      />
      <button
        type="button"
        onClick={onVoiceClick}
        aria-label="Falar com a Rubia"
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-panel hover:text-foreground"
      >
        <MicIcon className="size-5" />
      </button>
      <button
        type="submit"
        disabled={!value.trim()}
        aria-label="Enviar"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#681ce3] text-white transition-opacity disabled:opacity-40"
      >
        <SendIcon className="size-5" />
      </button>
    </form>
  );
}
