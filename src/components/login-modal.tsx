"use client";

import { useEffect } from "react";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="w-full max-w-sm rounded-2xl border border-line bg-panel p-6 text-foreground shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="login-title" className="mb-4 text-lg font-semibold">Entrar</h2>
        <form className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="E-mail"
            className="rounded-full border border-line bg-panel-muted px-4 py-2 text-foreground placeholder-muted outline-none focus:border-violet-500"
          />
          <input
            type="password"
            placeholder="Senha"
            className="rounded-full border border-line bg-panel-muted px-4 py-2 text-foreground placeholder-muted outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            className="mt-2 rounded-full bg-violet-600 px-5 py-2 font-medium text-white transition-colors hover:bg-violet-500"
          >
            Entrar
          </button>
        </form>
        <button onClick={onClose} className="mt-3 w-full text-center text-sm text-muted hover:text-foreground hover:underline">
          Cancelar
        </button>
      </div>
    </div>
  );
}
