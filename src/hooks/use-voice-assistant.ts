"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AssistantState = "idle" | "listening" | "thinking" | "speaking";

export const MOCK_REPLIES: Array<(text: string) => string> = [
  (text) => `Entendi: "${text}". Como posso te ajudar com isso?`,
  () => "Deixa eu verificar isso para você.",
  () => "Pode me dar mais detalhes sobre o que você precisa?",
];

export function useVoiceAssistant() {
  const [state, setState] = useState<AssistantState>("idle");
  const stateRef = useRef<AssistantState>("idle");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const setAssistantState = useCallback((next: AssistantState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const respond = useCallback(
    (heardText: string) => {
      if (stateRef.current === "thinking" || stateRef.current === "speaking") return;

      setAssistantState("thinking");
      recognitionRef.current?.stop();

      window.setTimeout(() => {
        const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)](heardText);
        setAssistantState("speaking");

        if (typeof window.speechSynthesis === "undefined") {
          setAssistantState("listening");
          try {
            recognitionRef.current?.start();
          } catch {}
          return;
        }

        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = "pt-BR";
        utterance.onend = () => {
          setAssistantState("listening");
          try {
            recognitionRef.current?.start();
          } catch {}
        };
        window.speechSynthesis.speak(utterance);
      }, 500);
    },
    [setAssistantState]
  );

  useEffect(() => {
    const Impl = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Impl) return;

    const recognition = new Impl();
    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setAssistantState("listening");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      if (transcript) respond(transcript);
    };

    recognition.onend = () => {
      if (stateRef.current === "listening" || stateRef.current === "idle") {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {}

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onend = null;
      recognition.abort();
    };
  }, [respond, setAssistantState]);

  return { state };
}
