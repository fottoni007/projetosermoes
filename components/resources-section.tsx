"use client";

import { Download, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { deleteResourceAction, uploadResourceAction } from "@/lib/resources";

type Item = { id: string; title: string; url: string | null };
type Props = { items: Item[]; isAdmin: boolean };

export default function ResourcesSection({ items, isAdmin }: Props) {
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    startTransition(async () => {
      const res = await uploadResourceAction(fd);
      setBusy(false);
      if (res.success) {
        formRef.current?.reset();
        router.refresh();
      } else {
        alert(res.error ?? "Erro ao enviar o ficheiro.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Apagar este material? Esta acção é irreversível.")) return;
    startTransition(async () => {
      const res = await deleteResourceAction(id);
      if (res.success) router.refresh();
      else alert(res.error ?? "Erro ao apagar.");
    });
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-ink">
        <FileText size={18} className="text-olive" />
        Materiais para download
      </h2>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-ink/50">Ainda não há materiais disponíveis.</p>
      ) : (
        <ul className="mt-4 divide-y divide-ink/5">
          {items.map((it) => (
            <li key={it.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span className="inline-flex min-w-0 items-center gap-2 text-sm text-ink/80">
                <FileText size={16} className="shrink-0 text-clay" />
                <span className="truncate">{it.title}</span>
              </span>
              <div className="flex items-center gap-2">
                {it.url && (
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-olive px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-olive/90"
                  >
                    <Download size={14} />
                    Descarregar
                  </a>
                )}
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(it.id)}
                    disabled={isPending}
                    className="inline-flex items-center rounded-md border border-clay/30 px-2.5 py-1.5 text-xs font-medium text-clay transition hover:bg-clay/5 disabled:opacity-50"
                    title="Apagar material"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {isAdmin && (
        <form ref={formRef} onSubmit={handleUpload} className="mt-5 rounded-lg border border-dashed border-ink/20 bg-mist/30 p-4">
          <p className="text-sm font-medium text-ink">Adicionar novo material (PDF, máx. 25 MB)</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              name="title"
              placeholder="Título do material"
              required
              className="rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
            />
            <input
              name="file"
              type="file"
              accept="application/pdf"
              required
              className="text-sm text-ink/70 file:mr-3 file:rounded-md file:border-0 file:bg-olive/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-olive"
            />
          </div>
          <button
            type="submit"
            disabled={isPending || busy}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-olive px-4 py-2 text-sm font-semibold text-white transition hover:bg-olive/90 disabled:opacity-60"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {busy ? "A enviar…" : "Adicionar material"}
          </button>
        </form>
      )}
    </div>
  );
}
