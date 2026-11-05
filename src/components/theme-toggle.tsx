"use client";

import { useTheme, type ThemeMode } from "@/hooks/use-theme";
import { DesktopIcon, MoonIcon, SunIcon } from "@/components/theme-icons";

// Order and glyphs match the Figma "E · Totem" sheet's mode legend (Sun / Moon / Desktop).
const MODES: { mode: ThemeMode; label: string; Icon: typeof SunIcon }[] = [
  { mode: "light", label: "Claro", Icon: SunIcon },
  { mode: "dark", label: "Escuro", Icon: MoonIcon },
  { mode: "system", label: "Sistema", Icon: DesktopIcon },
];

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div role="radiogroup" aria-label="Tema" className="flex items-center gap-1 rounded-full border border-line p-1">
      {MODES.map(({ mode: optionMode, label, Icon }) => {
        const active = mode === optionMode;
        return (
          <button
            key={optionMode}
            type="button"
            role="radio"
            aria-checked={active}
            title={label}
            aria-label={label}
            onClick={() => setMode(optionMode)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              active ? "bg-violet-600 text-white" : "text-muted hover:bg-panel-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
