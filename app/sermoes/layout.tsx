import { BookOpen, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { hasSupabaseConfig } from "@/lib/config";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";

export default async function SermonsLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!hasSupabaseConfig()) {
    return (
      <main className="min-h-screen bg-linen px-6 py-10">
        <section className="mx-auto max-w-2xl rounded-lg border border-ink/10 bg-white p-8 shadow-soft">
          <h1 className="text-2xl font-semibold text-ink">Configuração necessária</h1>
          <p className="mt-3 leading-7 text-ink/70">
            Copia o ficheiro .env.example para .env.local e preenche
            NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </p>
        </section>
      </main>
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = isAdminUser(user);

  return (
    <main className="min-h-screen bg-linen">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link className="inline-flex items-center gap-3" href="/sermoes">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-olive text-white">
              <BookOpen size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-olive">
                Pastor Fabrício Ottoni
              </span>
              <span className="text-xl font-semibold text-ink">
                Recursos úteis para o pregador
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {isAdmin ? (
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-olive/40 hover:text-olive"
                href="/sermoes/novo"
              >
                <Plus size={17} />
                Novo sermão
              </Link>
            ) : null}
            <form action="/logout" method="post">
              <button
                className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink/75 transition hover:border-clay/40 hover:text-clay"
                type="submit"
              >
                <LogOut size={17} />
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </main>
  );
}
