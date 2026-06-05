import { CalendarDays, Lightbulb, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { postCategoryLabel } from "@/lib/post-categories";
import { getPosts } from "@/lib/posts-data";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";

function excerpt(content: string, max = 180) {
  const text = content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !/^https?:\/\//.test(l) && !l.startsWith("![") && !l.startsWith("#") && !l.startsWith("-"))
    .join(" ");
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

export default async function DicasPreciosasPage() {
  const [user, posts] = await Promise.all([getCurrentUser(), getPosts()]);
  if (!user) redirect("/login");
  const admin = isAdminUser(user);

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Dicas Preciosas</h1>
          <p className="mt-1 text-sm text-ink/70">Artigos, reflexões e recursos para o teu ministério.</p>
        </div>
        {admin && (
          <Link href="/sermoes/dicas-preciosas/novo" className="inline-flex items-center gap-2 rounded-md bg-olive px-3 py-2 text-sm font-semibold text-white transition hover:bg-olive/90">
            <Plus size={16} /> Novo post
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/20 bg-white p-10 text-center">
          <Lightbulb className="mx-auto text-olive/50" size={28} />
          <p className="mt-3 text-sm text-ink/70">Ainda não há posts publicados.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/sermoes/dicas-preciosas/${post.id}`} className="block overflow-hidden rounded-xl border border-ink/10 bg-white shadow-soft transition hover:-translate-y-0.5 hover:border-olive/35">
              <div className="flex flex-col sm:flex-row">
                {post.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover_image_url} alt="" className="h-40 w-full object-cover sm:h-auto sm:w-48 sm:shrink-0" />
                )}
                <div className="flex-1 p-5">
                  <div className="flex flex-wrap gap-1.5">
                    {post.categories.map((c) => (
                      <span key={c} className="rounded-full bg-olive/10 px-2 py-0.5 text-xs font-semibold text-olive">{postCategoryLabel(c)}</span>
                    ))}
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-ink">{post.title}</h2>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-ink/70">{excerpt(post.content)}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/70">
                    <span className="inline-flex items-center gap-1.5"><UserRound size={13} /> {post.author}</span>
                    <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {new Intl.DateTimeFormat("pt-PT", { dateStyle: "long" }).format(new Date(post.published_at))}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
