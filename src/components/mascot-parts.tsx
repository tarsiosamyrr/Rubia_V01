export type EyePreset = "Pill" | "Round" | "Wide" | "Sleepy" | "Spark" | "Wink";
export type BodyPreset = "Ball" | "Squircle" | "Drop" | "Cloud";
export type MascotColor = "Violet" | "Lilac" | "Pink" | "Mint" | "Amber" | "Sky" | "Coral" | "Teal" | "Indigo" | "Lime" | "Rose" | "Slate";

export const EYE_PRESETS: EyePreset[] = ["Pill", "Round", "Wide", "Sleepy", "Spark", "Wink"];
export const BODY_PRESETS: BodyPreset[] = ["Ball", "Squircle", "Drop", "Cloud"];
export const MASCOT_COLORS: MascotColor[] = [
  "Violet",
  "Lilac",
  "Pink",
  "Mint",
  "Amber",
  "Sky",
  "Coral",
  "Teal",
  "Indigo",
  "Lime",
  "Rose",
  "Slate",
];

// Hex values measured from the Figma "Color swatch" component (first 6) plus extra
// options the user asked for — mascot colors are user content, not UI tokens, so
// they're fixed values rather than theme variables.
export const COLOR_HEX: Record<MascotColor, string> = {
  Violet: "#7b3ff2",
  Lilac: "#b89bfa",
  Pink: "#f472b6",
  Mint: "#34d399",
  Amber: "#fbbf24",
  Sky: "#38bdf8",
  Coral: "#fb7185",
  Teal: "#2dd4bf",
  Indigo: "#6366f1",
  Lime: "#a3e635",
  Rose: "#f43f5e",
  Slate: "#94a3b8",
};

// Darker shade of each hue, used for the mascot body gradient so the body itself
// (not the glow) reads as the selected color.
export const COLOR_DEEP_HEX: Record<MascotColor, string> = {
  Violet: "#2a1454",
  Lilac: "#3f2d6b",
  Pink: "#5a1f42",
  Mint: "#0f3d2c",
  Amber: "#4a3208",
  Sky: "#0b3a52",
  Coral: "#5a1a24",
  Teal: "#0b3b35",
  Indigo: "#212066",
  Lime: "#344611",
  Rose: "#551420",
  Slate: "#2c333d",
};

// Pixel grid for the tamagotchi's on-device "Pet sprite" (Figma node 31:165 Idle /
// 31:362 Happy, section "5 · Tamagotchi"): 16 cols, one char per 8px cell.
// . = empty, a = light ring, p = highlight, d = deep fill, E = eye/mouth (white).
// shortcut: same silhouette for every BodyPreset — the hardware sprite in Figma only
// defines one shape; upgrade to per-shape grids if the physical display needs it.
const PET_SPRITE_GRID_IDLE = [
  ".....aaaaaa.....",
  "....adddddda....",
  "...appdddddda...",
  "..appdddddddda..",
  ".adddddddddddda.",
  ".addEEddddEEdda.",
  ".addEEddddEEdda.",
  ".addEEddddEEdda.",
  ".addEEddddEEdda.",
  ".adddddddddddda.",
  "..adddddddddda..",
  "...adddddddda...",
  "....adddddda....",
  ".....aaaaaa.....",
];

const PET_SPRITE_GRID_HAPPY = [
  ".....aaaaaa.....",
  "....adddddda....",
  "...appdddddda...",
  "..appdddddddda..",
  ".adddddddddddda.",
  ".adddddddddddda.",
  ".adddEddddEddda.",
  ".addEdEddEdEdda.",
  ".adddddddddddda.",
  ".adddddddddddda.",
  "..adddEddEddda..",
  "...adddEEddda...",
  "....adddddda....",
  ".....aaaaaa.....",
];

export function TamagotchiSprite({
  color,
  state = "idle",
  size = 128,
}: {
  color: MascotColor;
  state?: "idle" | "happy";
  size?: number;
}) {
  const hex = COLOR_HEX[color];
  const deepHex = COLOR_DEEP_HEX[color];
  const grid = state === "happy" ? PET_SPRITE_GRID_HAPPY : PET_SPRITE_GRID_IDLE;
  const cell = size / 16;
  const fillFor: Record<string, string> = {
    a: `color-mix(in srgb, ${hex} 55%, white)`,
    p: hex,
    d: deepHex,
    E: "#ffffff",
  };

  return (
    <div className="relative shrink-0" style={{ width: size, height: cell * grid.length }}>
      {grid.map((row, y) =>
        row.split("").map((char, x) => {
          const fill = fillFor[char];
          if (!fill) return null;
          return (
            <div
              key={`${x}-${y}`}
              className="absolute"
              style={{ left: x * cell, top: y * cell, width: cell, height: cell, background: fill }}
            />
          );
        }),
      )}
    </div>
  );
}

const EYE_ASSET: Partial<Record<EyePreset, string>> = {
  Round: "/mascot/eye-round.svg",
  Sleepy: "/mascot/eye-sleepy.svg",
  Spark: "/mascot/eye-spark.svg",
  Wink: "/mascot/eye-wink.svg",
};

const BODY_ASSET: Partial<Record<BodyPreset, string>> = {
  Ball: "/mascot/body-ball.svg",
  Drop: "/mascot/body-drop.svg",
  Cloud: "/mascot/body-cloud.svg",
};

// shortcut: Drop/Cloud previews use a border-radius approximation, not the exact
// vector silhouette — upgrade to an SVG clip-path if pixel-accurate shapes are needed.
export const BODY_PREVIEW_RADIUS: Record<BodyPreset, string> = {
  Ball: "9999px",
  Squircle: "22%",
  Drop: "50% 50% 50% 0%",
  Cloud: "60% 40% 70% 30% / 50% 60% 40% 50%",
};

export function EyeGlyph({ preset, width, height }: { preset: EyePreset; width: number; height: number }) {
  const asset = EYE_ASSET[preset];
  if (asset) {
    // eslint-disable-next-line @next/next/no-img-element -- static design asset, no next/image config needed
    return <img src={asset} alt="" className="block" style={{ width, height }} />;
  }
  const wide = preset === "Wide";
  // Pill proportions and gap ratio measured from AssistantFace's idle eyes (home page).
  const pillStyle = wide ? { width: width * 0.3, height: height * 0.55 } : { width: height * (7 / 17), height };
  return (
    <div className="flex items-center justify-center" style={{ width, height, gap: pillStyle.width * 1.49 }}>
      <div className="rounded-full bg-[#ebe7f9] shadow-[0_0_6px_rgba(235,231,249,0.8)]" style={pillStyle} />
      <div className="rounded-full bg-[#ebe7f9] shadow-[0_0_6px_rgba(235,231,249,0.8)]" style={pillStyle} />
    </div>
  );
}

export function BodyGlyph({ preset, size }: { preset: BodyPreset; size: number }) {
  const asset = BODY_ASSET[preset];
  if (asset) {
    // eslint-disable-next-line @next/next/no-img-element -- static design asset, no next/image config needed
    return <img src={asset} alt="" className="block" style={{ width: size, height: size }} />;
  }
  return (
    <div
      className="border-[3px] border-[#ac80fa] bg-[#360584]"
      style={{ width: size, height: size, borderRadius: size * (18 / 56) }}
    />
  );
}
