"use client";

import { ImagePlus, Loader2, Save } from "lucide-react";
import { useActionState, useState, useTransition } from "react";
import { uploadPostImageAction } from "@/lib/posts";
import { POST_CATEGORIES } from "@/lib/post-categories";
import type { Post, PostFormState } from "@/types/post";

const initialState: PostFormState = { message: "" };
const inputClass =
  "mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10";
const labelClass = "text-sm font-medium text-ink";

function today() {
  return new Date().toISOString().slice(0, 10);
}

type Props = {
  action: (prev: PostFormState, fd: FormData) => Promise<PostFormState>;
  initialValues?: Post;
  submitLabel: string;
};

export default function PostForm({ action, initialValues, submitLabel }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [cover, setCover] = useState(initialValues?.cover_image_url ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [busyCover, setBusyCover] = useState(false);
  const [busyInline, setBusyInline] = useState(false);
  const [, startTransition] = useTransition();

  async function upload(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadPostImageAction(fd);
    if (res.success && res.url) return res.url;
    alert(res.error ?? "Erro ao enviar a imagem.");
    return null;
  }

  function onCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusyCover(true);
    startTransition(async () => {
      const url = await upload(f);
      if (url) setCover(url);
      setBusyCover(false);
    });
    e.target.value = "";
  }

  function onInline(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusyInline(true);
    startTransition(async () => {
      const url = await upload(f);
      if (url) setContent((c) => (c.trim() ? `${c}\n\n${url}\n` : `${url}\n`));
      setBusyInline(false);
    });
    e.target.value = "";
  }

  return (
    <form action={formAction} className="space-y-5 rounded-xl border border-ink/10 bg-white p-5 shadow-soft sm:p-6">
      <label className="block">
        <span className={labelClass}>Tema (título) *</span>
        <input className={inputClass} name="title" defaultValue={initialValues?.title ?? ""} required />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Autor *</span>
          <input className={inputClass} name="author" defaultValue={initialValues?.author ?? "Pastor Fabrício Ottoni"} required />
        </label>
        <label className="block">
          <span className={labelClass}>Data *</span>
          <input className={inputClass} name="published_at" type="date" defaultValue={initialValues?.published_at ?? today()} required />
        </label>
      </div>

      <div>
        <span className={labelClass}>Categorias *</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {POST_CATEGORIES.map((c) => (
            <label key={c.value} className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-ink/15 px-3 py-2 text-sm text-ink/75 transition hover:border-olive/40 has-[:checked]:border-olive has-[:checked]:bg-olive/5 has-[:checked]:text-olive">
              <input type="checkbox" name="categories" value={c.value} defaultChecked={initialValues?.categories?.includes(c.value)} className="h-4 w-4 accent-olive" />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className={labelClass}>Imagem de capa (opcional)</span>
        <input type="hidden" name="cover_image_url" value={cover} />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-ink/15 px-3 py-2 text-sm font-medium text-ink/75 transition hover:border-olive/40">
            {busyCover ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
            {cover ? "Trocar imagem" : "Carregar imagem"}
            <input type="file" accept="image/*" className="sr-only" onChange={onCover} />
          </label>
          {cover && (
            <span className="inline-flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="capa" className="h-12 w-20 rounded object-cover" />
              <button type="button" onClick={() => setCover("")} className="text-xs text-clay underline">remover</button>
            </span>
          )}
        </div>
      </div>

      <div>
        <span className={labelClass}>Conteúdo *</span>
        <textarea name="content" value={content} onChange={(e) => setContent(e.target.value)} required className="mt-2 min-h-[40vh] w-full rounded-md border border-ink/15 bg-white px-3 py-2 font-mono text-sm leading-6 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10" />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/75 transition hover:border-olive/40">
            {busyInline ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
            Inserir imagem no texto
            <input type="file" accept="image/*" className="sr-only" onChange={onInline} />
          </label>
          <p className="text-xs text-ink/45">Vídeo/podcast: cola o link (YouTube, Spotify ou Apple Podcasts) numa linha própria.</p>
        </div>
      </div>

      {state.message && (
        <p className="rounded-md bg-clay/10 px-3 py-2.5 text-sm text-clay">{state.message}</p>
      )}

      <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-md bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive/90 disabled:opacity-60">
        <Save size={17} />
        {isPending ? "A guardar…" : submitLabel}
      </button>
    </form>
  );
}
