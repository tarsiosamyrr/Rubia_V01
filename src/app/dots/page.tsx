"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MascotPreview from "@/components/mascot-preview";
import ThemeToggle from "@/components/theme-toggle";
import {
  BODY_PRESETS,
  BodyGlyph,
  COLOR_HEX,
  EYE_PRESETS,
  EyeGlyph,
  MASCOT_COLORS,
  TamagotchiSprite,
  type BodyPreset,
  type EyePreset,
  type MascotColor,
} from "@/components/mascot-parts";

type Step = "Eyes" | "Body" | "Color" | "Send";
const STEP_ORDER: Step[] = ["Eyes", "Body", "Color", "Send"];
const TAB_STEPS: Step[] = ["Eyes", "Body", "Color"];
const TAB_LABEL: Record<Step, string> = { Eyes: "Olhos", Body: "Corpo", Color: "Cor", Send: "" };

const STEP_COPY: Record<Step, { title: string; subtitle: string }> = {
  Eyes: {
    title: "Monte seu mascote",
    subtitle: "Escolha como ele vai ser. O que você montar aparece no app e no seu tamagotchi.",
  },
  Body: {
    title: "Monte seu mascote",
    subtitle: "Escolha como ele vai ser. O que você montar aparece no app e no seu tamagotchi.",
  },
  Color: {
    title: "Monte seu mascote",
    subtitle: "Escolha como ele vai ser. O que você montar aparece no app e no seu tamagotchi.",
  },
  Send: {
    title: "Dê um nome e envie",
    subtitle: "O nome passa por um filtro de palavras antes de ser salvo.",
  },
};

export default function TamagotchiBuilder() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("Eyes");
  const [eyePreset, setEyePreset] = useState<EyePreset>("Pill");
  const [bodyPreset, setBodyPreset] = useState<BodyPreset>("Ball");
  const [color, setColor] = useState<MascotColor>("Violet");
  const [name, setName] = useState("Bolt");
  const [sent, setSent] = useState(false);

  function handleSend() {
    setSent(true);
    const params = new URLSearchParams({ name: name.trim() || "Bolt", color });
    window.setTimeout(() => router.push(`/tamagotchi?${params.toString()}`), 700);
  }

  const stepIndex = STEP_ORDER.indexOf(step);
  const isTabStep = step !== "Send";
  const copy = STEP_COPY[step];

  function goBack() {
    if (stepIndex > 0) setStep(STEP_ORDER[stepIndex - 1]);
  }

  function goNext() {
    if (stepIndex < STEP_ORDER.length - 1) setStep(STEP_ORDER[stepIndex + 1]);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10 font-sans text-foreground">
      <div className="mb-4 flex w-full max-w-[880px] justify-end">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-[880px] flex-col overflow-hidden rounded-[28px] border border-line sm:min-h-[560px] sm:flex-row">
        <div className="flex flex-col items-center justify-center gap-4 bg-panel-muted px-6 py-10 sm:w-[340px] sm:shrink-0">
          <MascotPreview eyePreset={eyePreset} bodyPreset={bodyPreset} color={color} animated={step === "Send"} />
          <div className="text-center">
            <p className="text-[22px] font-semibold tracking-[-0.2px]">{name.trim() || "Bolt"}</p>
            <p className="text-[16px] text-muted">Prévia do seu mascote</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <p className="text-[17px] font-semibold tracking-[-0.2px]">{copy.title}</p>
            <p className="mt-1 text-[16px] tracking-[-0.2px] text-muted">{copy.subtitle}</p>
          </div>

          {isTabStep && (
            <div className="flex items-center gap-1 self-start rounded-full border border-line bg-panel-muted p-1 backdrop-blur-[15px]">
              {TAB_STEPS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStep(s)}
                  className={`rounded-full px-4 py-2 text-[15px] font-medium tracking-[-0.1px] transition-colors ${
                    step === s ? "bg-[#681ce3] text-white" : "text-muted hover:text-foreground"
                  }`}
                >
                  {TAB_LABEL[s]}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-1 flex-col gap-3">
            {step === "Eyes" && (
              <div className="grid grid-cols-3 gap-3">
                {EYE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setEyePreset(preset)}
                    aria-pressed={eyePreset === preset}
                    className={`flex h-[88px] w-full items-center justify-center rounded-[20px] border-2 transition-colors ${
                      eyePreset === preset
                        ? "border-[rgba(152,94,247,0.6)] bg-[rgba(104,28,227,0.12)]"
                        : "border-line bg-panel-muted hover:border-muted"
                    }`}
                  >
                    <EyeGlyph preset={preset} width={72} height={36} />
                  </button>
                ))}
              </div>
            )}

            {step === "Body" && (
              <div className="flex flex-wrap gap-3">
                {BODY_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setBodyPreset(preset)}
                    aria-pressed={bodyPreset === preset}
                    className={`flex h-[88px] w-[104px] items-center justify-center rounded-[20px] border-2 transition-colors ${
                      bodyPreset === preset
                        ? "border-[rgba(152,94,247,0.6)] bg-[rgba(104,28,227,0.12)]"
                        : "border-line bg-panel-muted hover:border-muted"
                    }`}
                  >
                    <BodyGlyph preset={preset} size={56} />
                  </button>
                ))}
              </div>
            )}

            {step === "Color" && (
              <div className="flex flex-wrap gap-4">
                {MASCOT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={c}
                    aria-pressed={color === c}
                    className="size-10 rounded-full"
                    style={{
                      background: COLOR_HEX[c],
                      border: color === c ? "3px solid #985ef7" : "1px solid var(--line)",
                    }}
                  />
                ))}
              </div>
            )}

            {step === "Send" && (
              <div className="flex flex-col gap-4">
                <div className="flex w-full max-w-[320px] flex-col gap-1.5">
                  <label className="text-[13px] text-muted">Nome do mascote</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 12))}
                    className="w-full rounded-[12px] border border-line bg-panel-muted px-4 py-3 text-[17px] tracking-[-0.2px] text-foreground outline-none focus:border-[#985ef7]"
                  />
                  <p className="text-[12px] font-medium text-muted">Até 12 letras. Sem palavras ofensivas.</p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-[rgba(61,214,140,0.16)] px-2 py-1 text-[12px] font-medium text-[#3dd68c]">
                  Tamagotchi conectado
                </span>
                <div className="animate-[mascot-bounce_0.9s_ease-in-out_infinite]">
                  <TamagotchiSprite color={color} state="happy" size={96} />
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto flex items-center gap-3 pt-4">
            {stepIndex > 0 ? (
              <button onClick={goBack} className="rounded-full px-5 py-3 text-[15px] font-medium text-muted hover:text-foreground">
                Voltar
              </button>
            ) : (
              <Link href="/" className="rounded-full px-5 py-3 text-[15px] font-medium text-muted hover:text-foreground">
                Voltar
              </Link>
            )}
            {step === "Send" ? (
              <button
                onClick={handleSend}
                disabled={sent || !name.trim()}
                className="rounded-full bg-[#681ce3] px-5 py-3 text-[15px] font-medium text-white shadow-[0_8px_14px_rgba(104,28,227,0.55)] transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sent ? "Enviado!" : "Enviar para o tamagotchi"}
              </button>
            ) : (
              <button
                onClick={goNext}
                className="rounded-full bg-[#681ce3] px-5 py-3 text-[15px] font-medium text-white shadow-[0_8px_14px_rgba(104,28,227,0.55)]"
              >
                Continuar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
