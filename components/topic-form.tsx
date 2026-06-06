"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";
import { FORUM_CATEGORIES } from "@/lib/forum-categories";
import type { ForumState } from "@/types/forum";

const initial: ForumState = { message: "" };
const inputClass = "mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10";

export default function TopicForm({ action }: { action: (prev: ForumState, fd: FormData) => Promise<ForumState> }) {
  const [state, formAction, isPending] = useActionState(action, initial);
  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-ink/10 bg-white p-5 shadow-soft sm:p-6">
      <label className="block">
        <span className="text-sm font-medium text-ink">Título do tópico *</span>
        <input name="title" required minLength={4} className={inputClass} placeholder="Ex.: Como estruturar uma introdução cativante?" />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-ink">Categoria *</span>
        <select name="category" defaultValue="" required className={inputClass}>
          <option value="" disabled>Seleciona uma categoria…</option>
          {FORUM_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-ink">Conteúdo *</span>
        <textarea name="body" required minLength={10} className={`${inputClass} min-h-44 leading-6`} placeholder="Partilha a tua questão ou reflexão sobre a arte da pregação..." />
      </label>

      {state.message && <p className="rounded-md bg-clay/10 px-3 py-2.5 text-sm text-clay">{state.message}</p>}
      <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-md bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive/90 disabled:opacity-60">
        <Save size={16} /> {isPending ? "A publicar…" : "Criar tópico"}
      </button>
    </form>
  );
}
