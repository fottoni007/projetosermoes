import { ArrowLeft, CalendarDays, Edit, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DeletePostButton from "@/components/delete-post-button";
import RichContent from "@/components/rich-content";
import { isAdminUser } from "@/lib/auth";
import { postCategoryLabel } from "@/lib/post-categories";
import { getPost } from "@/lib/posts-data";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const [user, post] = await Promise.all([getCurrentUser(), getPost(id)]);
  if (!user) redirect("/login");
  if (!post) notFound();
  const admin = isAdminUser(user);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/sermoes/dicas-preciosas" className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink/70 transition hover:border-olive/30 hover:text-olive">
          <ArrowLeft size={16} /> Voltar às Dicas
        </Link>
        {admin && (
          <div className="flex items-center gap-2">
            <Link href={`/sermoes/dicas-preciosas/${post.id}/editar`} className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-olive/30 hover:text-olive">
              <Edit size={15} /> Editar
            </Link>
            <DeletePostButton id={post.id} />
          </div>
        )}
      </div>

      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_image_url} alt="" className="mb-6 max-h-96 w-full rounded-xl object-cover" />
      )}

      <div className="flex flex-wrap gap-1.5">
        {post.categories.map((c) => (
          <span key={c} className="rounded-full bg-olive/10 px-2.5 py-0.5 text-xs font-semibold text-olive">{postCategoryLabel(c)}</span>
        ))}
      </div>
      <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">{post.title}</h1>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/70">
        <span className="inline-flex items-center gap-1.5"><UserRound size={14} className="text-olive" /> {post.author}</span>
        <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} className="text-olive" /> {new Intl.DateTimeFormat("pt-PT", { dateStyle: "long" }).format(new Date(post.published_at))}</span>
      </div>

      <div className="mt-6 space-y-4">
        <RichContent text={post.content} />
      </div>
    </article>
  );
}
