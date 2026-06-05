import { ArrowLeft, MessageSquare, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DeleteForumButton from "@/components/delete-forum-button";
import ForumText from "@/components/forum-text";
import ReplyForm from "@/components/reply-form";
import { isAdminUser } from "@/lib/auth";
import { createReplyAction, deleteReplyAction, deleteTopicAction } from "@/lib/forum";
import { forumCategoryLabel, forumCategoryStyle } from "@/lib/forum-categories";
import { getTopic } from "@/lib/forum-data";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function fmt(d: string) {
  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(d));
}

export default async function TopicPage({ params }: Props) {
  const { id } = await params;
  const [user, data] = await Promise.all([getCurrentUser(), getTopic(id)]);
  if (!user) redirect("/login");
  if (!data) notFound();

  const { topic, replies } = data;
  const admin = isAdminUser(user);
  const canDeleteTopic = admin || topic.author_id === user.id;
  const replyAction = createReplyAction.bind(null, id);
  const deleteTopic = deleteTopicAction.bind(null, id);

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href="/sermoes/forum" className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink/70 transition hover:border-olive/30 hover:text-olive">
          <ArrowLeft size={16} /> Voltar ao fórum
        </Link>
      </div>

      <article className="rounded-xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">{topic.title}</h1>
          {canDeleteTopic && (
            <DeleteForumButton action={deleteTopic} redirectTo="/sermoes/forum" confirmText="Apagar este tópico e todas as respostas?" />
          )}
        </div>
        <div className="mt-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${forumCategoryStyle(topic.category)}`}>{forumCategoryLabel(topic.category)}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/55">
          <span className="inline-flex items-center gap-1.5"><UserRound size={13} className="text-olive" /> {topic.author_name}</span>
          <span>{fmt(topic.created_at)}</span>
        </div>
        <div className="mt-4"><ForumText text={topic.body} /></div>
      </article>

      <div className="mt-6">
        <h2 className="mb-3 inline-flex items-center gap-2 text-lg font-semibold text-ink">
          <MessageSquare size={18} className="text-olive" /> {replies.length} {replies.length === 1 ? "resposta" : "respostas"}
        </h2>
        {replies.length > 0 && (
          <div className="grid gap-3">
            {replies.map((r) => {
              const canDelete = admin || r.author_id === user.id;
              const del = deleteReplyAction.bind(null, r.id);
              return (
                <div key={r.id} className="rounded-xl border border-ink/10 bg-white p-4 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink/55">
                      <span className="inline-flex items-center gap-1.5 font-medium text-ink/70"><UserRound size={12} className="text-olive" /> {r.author_name}</span>
                      <span>{fmt(r.created_at)}</span>
                    </div>
                    {canDelete && <DeleteForumButton action={del} small confirmText="Apagar esta resposta?" />}
                  </div>
                  <div className="mt-2"><ForumText text={r.body} /></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold text-ink">Deixa a tua resposta</h3>
        <ReplyForm action={replyAction} />
      </div>
    </section>
  );
}
