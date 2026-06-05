"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error";
type Toast = { id: number; message: string; type: ToastType };

const ToastContext = createContext<(message: string, type?: ToastType) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-[1000] flex w-[min(92vw,22rem)] flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-2.5 rounded-lg border bg-white px-4 py-3 text-sm shadow-soft ${
              t.type === "error" ? "border-clay/30" : "border-olive/30"
            }`}
          >
            {t.type === "error" ? (
              <XCircle size={18} className="mt-0.5 shrink-0 text-clay" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-olive" />
            )}
            <span className="text-ink/80">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
