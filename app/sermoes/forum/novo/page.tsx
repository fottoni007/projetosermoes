import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import TopicForm from "@/components/topic-form";
import { createTopicAction } from "@/lib/forum";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";

export default async function NovoTopicoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href="/sermoes/forum" className="inline-flex items-center gap-1.5 text-sm text-ink/50 transition hover:text-olive">
          <ArrowLeft size={15} /> Voltar ao fórum
        </Link>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-ink sm:text-3xl">Novo tópico</h1>
      <p className="mb-6 text-sm text-ink/60">Lembra-te: o fórum é dedicado exclusivamente à arte da pregação.</p>
      <TopicForm action={createTopicAction} />
    </section>
  );
}
