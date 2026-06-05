"use client";

import { Send } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import type { ForumState } from "@/types/forum";

const initial: ForumState = { message: "" };

export default function ReplyForm({ action }: { action: (prev: ForumState, fd: FormData) => Promise<ForumState> }) {
  const [state, formAction, isPending] = useActionState(action, initial);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="rounded-xl border border-ink/10 bg-white p-4 shadow-soft">
      <textarea name="body" required rows={3} className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm leading-6 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10" placeholder="Escreve a tua resposta..." />
      {state.message && !state.success && <p className="mt-2 text-sm text-clay">{state.message}</p>}
      <button type="submit" disabled={isPending} className="mt-3 inline-flex items-center gap-2 rounded-md bg-olive px-4 py-2 text-sm font-semibold text-white transition hover:bg-olive/90 disabled:opacity-60">
        <Send size={15} /> {isPending ? "A enviar…" : "Responder"}
      </button>
    </form>
  );
}
