"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Ratios measured from the Figma "Oxy" component (200x200 base frame).
const ORB_SHIFT_RATIO = 2.8 / 200; // whole sphere parallax
const EYES_SHIFT_RATIO = 14 / 200; // eyes move further than the sphere

// Eye center-to-center distance stays constant across states in Figma, so we
// derive the gap between the pills from it instead of a fixed gap.
const EYE_CENTER_GAP_RATIO = 0.174;

const EXPRESSION_HOLD_MS = 3000;
const BLINK_MS = 120;
const AUTO_BLINK_INTERVAL_MS = 7000;

export type AssistantFaceState = "idle" | "listening" | "thinking" | "speaking";
const ALL_STATES: AssistantFaceState[] = ["idle", "listening", "thinking", "speaking"];

const GLOW_BY_STATE: Record<AssistantFaceState, string> = {
  idle: "radial-gradient(circle, rgba(139,92,246,0.55) 0%, var(--glow-mid-idle) 55%, transparent 75%)",
  listening: "radial-gradient(circle, rgba(139,92,246,0.7) 0%, var(--glow-mid-listening) 55%, transparent 75%)",
  thinking: "radial-gradient(circle, rgba(96,165,250,0.7) 0%, var(--glow-mid-thinking) 55%, transparent 75%)",
  speaking: "radial-gradient(circle, rgba(236,72,196,0.75) 0%, var(--glow-mid-speaking) 55%, transparent 75%)",
};

const PULSE_ANIMATION_BY_STATE: Record<AssistantFaceState, string> = {
  idle: "",
  listening: "animate-[assistant-pulse_2.6s_ease-in-out_infinite]",
  thinking: "animate-[assistant-pulse_1s_ease-in-out_infinite]",
  speaking: "animate-[assistant-pulse_0.45s_ease-in-out_infinite]",
};

// Eye-pill size per state, measured from the Figma "Oxy" sheet (Idle/Listening/Thinking/Speaking rows).
const EYE_SIZE_RATIO_BY_STATE: Record<AssistantFaceState, { width: number; height: number }> = {
  idle: { width: 0.07, height: 0.17 },
  listening: { width: 0.08, height: 0.2 },
  thinking: { width: 0.055, height: 0.055 },
  speaking: { width: 0.075, height: 0.19 },
};

export default function AssistantFace({
  size = 176,
  interactive = true,
  state = "idle",
}: {
  size?: number;
  interactive?: boolean;
  state?: AssistantFaceState;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const expressionLockRef = useRef(false);
  const expressionTimeoutRef = useRef<number | null>(null);

  const [displayState, setDisplayState] = useState<AssistantFaceState>(state);
  const [blinking, setBlinking] = useState(false);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
    if (!expressionLockRef.current) setDisplayState(state);
  }, [state]);

  useEffect(() => {
    if (!interactive) return;
    const handleMove = (e: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
      const dist = Math.min(Math.hypot(e.clientX - cx, e.clientY - cy) / (rect.width / 2), 1);
      const ux = Math.cos(angle) * dist;
      const uy = Math.sin(angle) * dist;
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${ux * size * ORB_SHIFT_RATIO}px, ${uy * size * ORB_SHIFT_RATIO}px)`;
      }
      if (eyesRef.current) {
        eyesRef.current.style.transform = `translate(${ux * size * EYES_SHIFT_RATIO}px, ${uy * size * EYES_SHIFT_RATIO}px)`;
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [size, interactive]);

  useEffect(() => {
    return () => {
      if (expressionTimeoutRef.current) window.clearTimeout(expressionTimeoutRef.current);
    };
  }, []);

  const blinkTo = useCallback((next: AssistantFaceState) => {
    setBlinking(true);
    window.setTimeout(() => {
      setDisplayState(next);
      window.setTimeout(() => setBlinking(false), BLINK_MS);
    }, BLINK_MS);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (expressionLockRef.current) return;
      blinkTo(stateRef.current);
    }, AUTO_BLINK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [blinkTo]);

  function handleClick() {
    if (!interactive || expressionLockRef.current) return;
    const options = ALL_STATES.filter((s) => s !== displayState);
    const next = options[Math.floor(Math.random() * options.length)];
    expressionLockRef.current = true;
    blinkTo(next);
    expressionTimeoutRef.current = window.setTimeout(() => {
      blinkTo(stateRef.current);
      expressionLockRef.current = false;
    }, BLINK_MS * 2 + EXPRESSION_HOLD_MS);
  }

  const eyeSize = EYE_SIZE_RATIO_BY_STATE[displayState];

  return (
    <div
      ref={rootRef}
      onClick={handleClick}
      style={{ width: size, height: size }}
      className={`relative shrink-0 ${interactive ? "cursor-pointer" : ""}`}
    >
      <div
        className={`absolute rounded-full ${PULSE_ANIMATION_BY_STATE[state]}`}
        style={{
          inset: -size * 0.3,
          background: GLOW_BY_STATE[state],
          filter: `blur(${size * 0.08}px)`,
        }}
      />
      <div
        ref={orbRef}
        className="absolute overflow-hidden rounded-full transition-transform duration-75 ease-out"
        style={{
          inset: size * 0.18,
          background: "linear-gradient(135deg, #0f0a22 0%, #2a1454 45%, #6e2b8c 100%)",
          boxShadow: "0 0 0 1.5px rgba(203,189,246,0.9) inset",
        }}
      >
        <div
          className="absolute rounded-full bg-white/25"
          style={{ left: "16%", top: "8%", width: "42%", height: "28%", filter: `blur(${size * 0.06}px)` }}
        />
        <div
          ref={eyesRef}
          className="absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-out"
        >
          <div
            className="flex items-center justify-center transition-[transform,gap] ease-in-out"
            style={{
              gap: size * EYE_CENTER_GAP_RATIO - size * eyeSize.width,
              transform: blinking ? "scaleY(0.08)" : "scaleY(1)",
              transitionDuration: `${BLINK_MS}ms`,
            }}
          >
            <div
              className="rounded-full bg-[#ebe7f9] shadow-[0_0_6px_rgba(235,231,249,0.8)] transition-[width,height] duration-150"
              style={{ width: size * eyeSize.width, height: size * eyeSize.height }}
            />
            <div
              className="rounded-full bg-[#ebe7f9] shadow-[0_0_6px_rgba(235,231,249,0.8)] transition-[width,height] duration-150"
              style={{ width: size * eyeSize.width, height: size * eyeSize.height }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
