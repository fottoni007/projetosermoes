"use client";

import { Pencil, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import RichContent from "@/components/rich-content";
import { updateSitePageAction } from "@/lib/update-site-page";

type Props = {
  slug: string;
  title: string;
  initialContent: string;
  isAdmin: boolean;
};

export default function EditablePage({ slug, title, initialContent, isAdmin }: Props) {
  const [content, setContent] = useState(initialContent);
  const [draft, setDraft] = useState(initialContent);
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function startEdit() { setDraft(content); setEditing(true); }

  function save() {
    startTransition(async () => {
      const res = await updateSitePageAction(slug, draft);
      if (res.success) { setContent(draft); setEditing(false); router.refresh(); }
      else alert(res.error ?? "Erro ao guardar.");
    });
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
        {isAdmin && !editing && (
          <button onClick={startEdit} className="inline-flex shrink-0 items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-olive/30 hover:text-olive">
            <Pencil size={15} />
            Editar
          </button>
        )}
      </div>

      {editing ? (
        <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-soft sm:p-6">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="min-h-[55vh] w-full rounded-md border border-ink/15 bg-white px-3 py-2 font-mono text-sm leading-6 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10" />
          <div className="mt-2 space-y-1 text-xs text-ink/45">
            <p>Formatação: linha em branco entre parágrafos · &ldquo;## &rdquo; subtítulo · &ldquo;- &rdquo; lista.</p>
            <p>Vídeo/podcast/imagem: cola o link numa linha própria (YouTube, Spotify, Apple Podcasts ou URL de imagem).</p>
            <p>Emails e links tornam-se automaticamente clicáveis.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={save} disabled={isPending} className="inline-flex items-center gap-2 rounded-md bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive/90 disabled:opacity-60">
              <Save size={16} />
              {isPending ? "A guardar…" : "Guardar"}
            </button>
            <button onClick={() => setEditing(false)} disabled={isPending} className="inline-flex items-center gap-2 rounded-md border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-mist disabled:opacity-60">
              <X size={16} />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <article className="space-y-4 rounded-xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          {content.trim() ? <RichContent text={content} /> : <p className="text-ink/40">Sem conteúdo.</p>}
        </article>
      )}
    </section>
  );
}
