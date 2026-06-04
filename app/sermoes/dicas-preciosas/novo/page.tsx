import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import PostForm from "@/components/post-form";
import { isAdminUser } from "@/lib/auth";
import { createPostAction } from "@/lib/posts";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function NovoPostPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isAdminUser(user)) redirect("/sermoes/dicas-preciosas");

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href="/sermoes/dicas-preciosas" className="inline-flex items-center gap-1.5 text-sm text-ink/50 transition hover:text-olive">
          <ArrowLeft size={15} /> Voltar
        </Link>
      </div>
      <h1 className="mb-6 text-2xl font-bold text-ink sm:text-3xl">Novo post</h1>
      <PostForm action={createPostAction} submitLabel="Publicar post" />
    </section>
  );
}
