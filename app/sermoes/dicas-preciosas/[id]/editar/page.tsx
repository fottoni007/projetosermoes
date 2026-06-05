import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PostForm from "@/components/post-form";
import { isAdminUser } from "@/lib/auth";
import { updatePostAction } from "@/lib/posts";
import { getPost } from "@/lib/posts-data";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const [user, post] = await Promise.all([getCurrentUser(), getPost(id)]);
  if (!user) redirect("/login");
  if (!isAdminUser(user)) redirect("/sermoes/dicas-preciosas");
  if (!post) notFound();

  const action = updatePostAction.bind(null, id);

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href={`/sermoes/dicas-preciosas/${id}`} className="inline-flex items-center gap-1.5 text-sm text-ink/70 transition hover:text-olive">
          <ArrowLeft size={15} /> Voltar ao post
        </Link>
      </div>
      <h1 className="mb-6 text-2xl font-bold text-ink sm:text-3xl">Editar post</h1>
      <PostForm action={action} initialValues={post} submitLabel="Guardar alterações" />
    </section>
  );
}
