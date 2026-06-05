import { ArrowLeft, Bell, MessageSquare } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import MarkRead from "@/components/mark-read";
import { getNotifications } from "@/lib/notifications-data";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";

export default async function NotificacoesPage() {
  const [user, notifications] = await Promise.all([getCurrentUser(), getNotifications()]);
  if (!user) redirect("/login");

  return (
    <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <MarkRead />
      <div className="mb-6">
        <Link href="/sermoes/forum" className="inline-flex items-center gap-1.5 text-sm text-ink/50 transition hover:text-olive">
          <ArrowLeft size={15} /> Voltar ao fórum
        </Link>
      </div>
      <h1 className="mb-6 inline-flex items-center gap-2 text-2xl font-bold text-ink sm:text-3xl">
        <Bell size={24} className="text-olive" /> Notificações
      </h1>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/20 bg-white p-10 text-center text-sm text-ink/55">
          Não tens notificações de momento.
        </div>
      ) : (
        <div className="grid gap-2">
          {notifications.map((n) => (
            <Link
              key={n.id}
              href={n.topic_id ? `/sermoes/forum/${n.topic_id}` : "/sermoes/forum"}
              className={`flex items-start gap-3 rounded-xl border p-4 shadow-soft transition hover:border-olive/35 ${n.read ? "border-ink/10 bg-white" : "border-olive/30 bg-olive/5"}`}
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive/10 text-olive">
                <MessageSquare size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-6 text-ink/80">
                  <strong className="text-ink">{n.actor_name}</strong> respondeu ao tópico{" "}
                  <strong className="text-ink">{n.topic_title}</strong>.
                </p>
                <p className="mt-0.5 text-xs text-ink/45">
                  {new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(n.created_at))}
                </p>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-olive" />}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
