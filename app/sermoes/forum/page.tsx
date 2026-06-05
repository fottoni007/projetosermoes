import { MessageSquare, MessagesSquare, Plus, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ForumSearch from "@/components/forum-search";
import { FORUM_CATEGORIES, forumCategoryLabel, forumCategoryStyle } from "@/lib/forum-categories";
import { getTopics } from "@/lib/forum-data";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string; cat?: string }> };

export default async function ForumPage({ searchParams }: Props) {
  const params = await searchParams;
  const [user, topics] = await Promise.all([getCurrentUser(), getTopics(params.q, params.cat)]);
  if (!user) redirect("/login");

  const hrefFor = (cat?: string) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (cat) sp.set("cat", cat);
    const qs = sp.toString();
    return `/sermoes/forum${qs ? `?${qs}` : ""}`;
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-medium transition ${active ? "border-olive bg-olive/10 text-olive" : "border-ink/15 text-ink/60 hover:border-olive/40"}`;

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Fórum da Pregação</h1>
          <p className="mt-1 text-sm text-ink/65">Debate, partilha e aprende sobre a arte de pregar.</p>
        </div>
        <Link href="/sermoes/forum/novo" className="inline-flex items-center gap-2 rounded-md bg-olive px-3 py-2 text-sm font-semibold text-white transition hover:bg-olive/90">
          <Plus size={16} /> Novo tópico
        </Link>
      </div>

      <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-olive/20 bg-olive/5 px-4 py-3 text-sm text-ink/70">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-olive" />
        <p>
          Este espaço destina-se exclusivamente a temas sobre a arte da pregação. Mantém um tom respeitoso —
          comentários ofensivos serão removidos pela administração. Consulta as regras completas na página de{" "}
          <Link href="/rgpd" className="font-medium text-olive underline">Privacidade e RGPD</Link>.
        </p>
      </div>

      <div className="mb-4"><ForumSearch defaultValue={params.q ?? ""} /></div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href={hrefFor()} className={chip(!params.cat)}>Todas</Link>
        {FORUM_CATEGORIES.map((c) => (
          <Link key={c.value} href={hrefFor(c.value)} className={chip(params.cat === c.value)}>{c.label}</Link>
        ))}
      </div>

      {topics.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/20 bg-white p-10 text-center">
          <MessagesSquare className="mx-auto text-olive/50" size={28} />
          <p className="mt-3 text-sm text-ink/60">
            {params.q || params.cat ? "Nenhum tópico encontrado com estes critérios." : "Ainda não há tópicos. Sê o primeiro a iniciar uma conversa!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {topics.map((t) => (
            <Link key={t.id} href={`/sermoes/forum/${t.id}`} className="block rounded-xl border border-ink/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-olive/35">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${forumCategoryStyle(t.category)}`}>{forumCategoryLabel(t.category)}</span>
                <h2 className="text-base font-semibold text-ink sm:text-lg">{t.title}</h2>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/55">
                <span className="inline-flex items-center gap-1.5"><UserRound size={13} /> {t.author_name}</span>
                <span className="inline-flex items-center gap-1.5"><MessageSquare size={13} /> {t.reply_count} {t.reply_count === 1 ? "resposta" : "respostas"}</span>
                <span>{new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(new Date(t.created_at))}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
