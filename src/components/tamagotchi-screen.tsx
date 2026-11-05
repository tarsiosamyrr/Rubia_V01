"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import { MASCOT_COLORS, TamagotchiSprite, type MascotColor } from "@/components/mascot-parts";

function isMascotColor(value: string | null): value is MascotColor {
  return !!value && (MASCOT_COLORS as string[]).includes(value);
}

// Default meter state measured from the Figma "Pet screen / Screen=Pet" reference
// (node 31:1224): fed and happy, energy partly spent — this page has no game loop yet.
const METERS: { label: string; filled: number; tone: "success" | "warning" }[] = [
  { label: "Fome", filled: 8, tone: "success" },
  { label: "Energia", filled: 5, tone: "warning" },
  { label: "Alegria", filled: 8, tone: "success" },
];

const TONE_HEX: Record<"success" | "warning", string> = {
  success: "#3dd68c",
  warning: "#f5b544",
};

function PetMeterRow({ label, filled, tone }: { label: string; filled: number; tone: "success" | "warning" }) {
  return (
    <div className="flex items-center gap-2">
      <p className="w-[60px] font-mono text-[11px] leading-4 text-[#a99dc4]">{label}</p>
      <div className="flex items-center gap-[2px]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[10px] w-[14px]"
            style={{ background: i < filled ? TONE_HEX[tone] : "rgba(255,255,255,0.1)" }}
          />
        ))}
      </div>
    </div>
  );
}

function PetSystemBar() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="flex h-6 w-full shrink-0 items-center justify-between bg-[#1f1438] px-2 py-1">
      <p className="font-mono text-[12px] leading-4 text-[#f4f0fb]">{time}</p>
      <div className="flex items-end gap-2">
        <div className="flex items-end gap-px">
          <div className="h-1 w-[3px] bg-[#f4f0fb]" />
          <div className="h-[7px] w-[3px] bg-[#f4f0fb]" />
          <div className="h-[10px] w-[3px] bg-[#f4f0fb]" />
        </div>
        <div className="relative h-[10px] w-5 border border-[#f4f0fb]">
          <div className="absolute left-px top-px h-[6px] w-[14px] bg-[#3dd68c]" />
          <div className="absolute -right-[3px] top-[2px] h-1 w-[2px] bg-[#f4f0fb]" />
        </div>
      </div>
    </div>
  );
}

export default function TamagotchiScreen() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name")?.trim().slice(0, 12) || "Bolt";
  const color: MascotColor = isMascotColor(searchParams.get("color")) ? (searchParams.get("color") as MascotColor) : "Violet";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 py-10 font-sans text-foreground">
      <div className="flex w-full max-w-[400px] items-center justify-between">
        <Link href="/dots" className="text-[15px] font-medium text-muted hover:text-foreground">
          Voltar
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-4 rounded-[28px] border border-line bg-panel p-6">
        <div
          className="overflow-hidden rounded-[18px] border-4 border-[#1f1438] bg-[#0e0819]"
          style={{ width: 240, height: 240 }}
        >
          <PetSystemBar />
          <div className="flex h-[216px] w-[240px] flex-col items-center justify-center gap-2 p-2">
            <div className="animate-[mascot-bounce_1.4s_ease-in-out_infinite]">
              <TamagotchiSprite color={color} state="happy" size={128} />
            </div>
            <div className="flex flex-col items-start gap-1">
              {METERS.map((meter) => (
                <PetMeterRow key={meter.label} {...meter} />
              ))}
            </div>
          </div>
        </div>
        <p className="text-[17px] font-semibold tracking-[-0.2px]">{name}</p>
      </div>
    </div>
  );
}
