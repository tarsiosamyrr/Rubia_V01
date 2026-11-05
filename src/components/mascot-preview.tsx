"use client";

import { BODY_PREVIEW_RADIUS, COLOR_DEEP_HEX, COLOR_HEX, EyeGlyph, type BodyPreset, type EyePreset, type MascotColor } from "./mascot-parts";

export default function MascotPreview({
  size = 200,
  eyePreset = "Pill",
  bodyPreset = "Ball",
  color = "Violet",
  animated = false,
}: {
  size?: number;
  eyePreset?: EyePreset;
  bodyPreset?: BodyPreset;
  color?: MascotColor;
  animated?: boolean;
}) {
  const hex = COLOR_HEX[color];
  const deepHex = COLOR_DEEP_HEX[color];

  return (
    <div
      className={`relative shrink-0 ${animated ? "animate-[mascot-bounce_0.9s_ease-in-out_infinite]" : ""}`}
      style={{ width: size, height: size }}
    >
      <div
        className={`absolute rounded-full ${animated ? "animate-[assistant-pulse_0.9s_ease-in-out_infinite]" : ""}`}
        style={{
          inset: -size * 0.3,
          background: `radial-gradient(circle, ${hex}8c 0%, ${hex}40 55%, transparent 75%)`,
          filter: `blur(${size * 0.08}px)`,
        }}
      />
      <div
        className="absolute overflow-hidden transition-[border-radius,background] duration-200"
        style={{
          inset: size * 0.18,
          borderRadius: BODY_PREVIEW_RADIUS[bodyPreset],
          background: `linear-gradient(135deg, ${deepHex} 0%, ${hex} 100%)`,
          boxShadow: `0 0 0 1.5px ${hex}cc inset`,
        }}
      >
        <div
          className="absolute rounded-full bg-white/25"
          style={{ left: "16%", top: "8%", width: "42%", height: "28%", filter: `blur(${size * 0.06}px)` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <EyeGlyph preset={eyePreset} width={size * 0.4} height={size * 0.2} />
        </div>
      </div>
    </div>
  );
}
