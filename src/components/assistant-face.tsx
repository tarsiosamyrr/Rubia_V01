"use client";

import { useEffect, useRef } from "react";

const PUPIL_RANGE = 7;

function moveEye(eye: HTMLDivElement | null, pupil: HTMLDivElement | null, x: number, y: number) {
  if (!eye || !pupil) return;
  const rect = eye.getBoundingClientRect();
  const angle = Math.atan2(y - (rect.top + rect.height / 2), x - (rect.left + rect.width / 2));
  pupil.style.transform = `translate(${Math.cos(angle) * PUPIL_RANGE}px, ${Math.sin(angle) * PUPIL_RANGE}px)`;
}

export default function AssistantFace() {
  const eyes = useRef<(HTMLDivElement | null)[]>([]);
  const pupils = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      eyes.current.forEach((eye, i) => moveEye(eye, pupils.current[i], e.clientX, e.clientY));
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg sm:h-44 sm:w-44">
      <div className="flex gap-6">
        {[0, 1].map((i) => (
          <div
            key={i}
            ref={(el) => {
              eyes.current[i] = el;
            }}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white sm:h-12 sm:w-12"
          >
            <div
              ref={(el) => {
                pupils.current[i] = el;
              }}
              className="h-4 w-4 rounded-full bg-slate-900 transition-transform duration-75 ease-out sm:h-5 sm:w-5"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
