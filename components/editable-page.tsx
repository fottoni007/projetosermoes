"use client";

import { Pencil, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateSitePageAction } from "@/lib/update-site-page";

// Extrai o ID de um vídeo do YouTube a partir de um link OU de um código de
// incorporação (<iframe ... src="...youtube.com/embed/ID...">). Devolve null se não houver.
function extractYouTubeId(text: string): string | null {
  const patterns = [
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube-nocookie\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1];
  }
  return null;
}

// Renderizador seguro: linha em branco = parágrafo, "## " = subtítulo,
// "### " = subtítulo menor, "- " = lista, link/embed do YouTube = player.
// Nunca injecta HTML arbitrário — só constrói nós React controlados.
function renderContent(text: string) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let k = 0;

  const flushPara = () => {
    if (para.length) {
      blocks.push(<p key={k++} className="leading-7 text-ink/75">{para.join(" ")}</p>);
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={k++} className="list-disc space-y-1.5 pl-5 leading-7 text-ink/75">
          {list.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      );
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();

    // Vídeo do YouTube (link ou código de incorporação) numa linha própria
    const yt = extractYouTubeId(raw);
    if (yt) {
      flushPara();
      flushList();
      blocks.push(
        <div key={k++} className="my-4 aspect-video w-full overflow-hidden rounded-lg border border-ink/10 bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${yt}`}
            title="Vídeo do YouTube"
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      );
      continue;
    }

    if (line === "") { flushPara(); flushList(); continue; }
    if (line.startsWith("### ")) { flushPara(); flushList(); blocks.push(<h3 key={k++} className="mt-5 text-base font-semibold text-ink">{line.slice(4)}</h3>); continue; }
    if (line.startsWith("## ")) { flushPara(); flushList(); blocks.push(<h2 key={k++} className="mt-7 text-lg font-semibold text-ink">{line.slice(3)}</h2>); continue; }
    if (line.startsWith("- ")) { flushPara(); list.push(line.slice(2)); continue; }
    flushList();
    para.push(line);
  }
  flushPara(); flushList();
  return blocks;
}

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

  function startEdit() {
    setDraft(content);
    setEditing(true);
  }

  function save() {
    startTransition(async () => {
      const res = await updateSitePageAction(slug, draft);
      if (res.success) {
        setContent(draft);
        setEditing(false);
        router.refresh();
      } else {
        alert(res.error ?? "Erro ao guardar.");
      }
    });
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
        {isAdmin && !editing && (
          <button
            onClick={startEdit}
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-olive/30 hover:text-olive"
          >
            <Pencil size={15} />
            Editar
          </button>
        )}
      </div>

      {editing ? (
        <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-soft sm:p-6">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-[55vh] w-full rounded-md border border-ink/15 bg-white px-3 py-2 font-mono text-sm leading-6 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
          />
          <div className="mt-2 space-y-1 text-xs text-ink/45">
            <p>Formatação: deixa uma linha em branco entre parágrafos · &ldquo;## &rdquo; cria um subtítulo · &ldquo;- &rdquo; cria um item de lista.</p>
            <p>Vídeo do YouTube: cola o link (ou o código de incorporação) numa linha própria — aparece automaticamente como player.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={save}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-md bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive/90 disabled:opacity-60"
            >
              <Save size={16} />
              {isPending ? "A guardar…" : "Guardar"}
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-md border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-mist disabled:opacity-60"
            >
              <X size={16} />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <article className="space-y-4 rounded-xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          {content.trim() ? renderContent(content) : (
            <p className="text-ink/40">Sem conteúdo.</p>
          )}
        </article>
      )}
    </section>
  );
}
