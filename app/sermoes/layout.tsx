import { BookOpen, CheckSquare, Download, Feather, Info, Lightbulb, LogOut, Plus, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import TabNav from "@/components/tab-nav";
import { isAdminUser } from "@/lib/auth";
import { hasSupabaseConfig } from "@/lib/config";
import { getMyPastorProfile, isApprovedPastor, listPendingPastorProfiles } from "@/lib/pastor-profiles";
import { getCurrentUser, listPendingSermons } from "@/lib/sermons";

export const dynamic = "force-dynamic";

export default async function SermonsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!hasSupabaseConfig()) {
    return (
      <main className="min-h-screen bg-linen px-4 py-10 sm:px-6">
        <section className="mx-auto max-w-2xl rounded-xl border border-ink/10 bg-white p-8 shadow-soft">
          <h1 className="text-2xl font-semibold text-ink">Configuração necessária</h1>
          <p className="mt-3 leading-7 text-ink/70">
            Preenche as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </p>
        </section>
      </main>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const admin = isAdminUser(user);
  const approved = await isApprovedPastor();
  const profile = admin ? null : await getMyPastorProfile();

  const [pendingProfiles, pendingSermons] = admin
    ? await Promise.all([listPendingPastorProfiles(), listPendingSermons()])
    : [[], []];

  const pendingCount =
    pendingProfiles.filter((p) => p.status === "pending").length + pendingSermons.length;

  const profileLabel = !profile
    ? "Perfil de pastor"
    : profile.status === "pending"
    ? "Perfil — Pendente"
    : profile.status === "rejected"
    ? "Perfil — Revisto"
    : "O meu perfil";

  // Padrão fixo: Sermões · A Arte da Pregação · Sobre (+ admin: A Aprovar · Pastores)
  const tabs = [
    { href: "/sermoes", label: "Sermões", exact: true },
    { href: "/sermoes/arte-pregacao", label: "A Arte da Pregação", icon: <Feather size={14} /> },
    { href: "/sermoes/dicas-preciosas", label: "Dicas Preciosas", icon: <Lightbulb size={14} /> },
    { href: "/sermoes/downloads", label: "Downloads", icon: <Download size={14} /> },
    { href: "/sermoes/sobre", label: "Sobre", icon: <Info size={14} /> },
    ...(admin
      ? [
          {
            href: "/sermoes/aprovar",
            label: "A Aprovar",
            icon: <CheckSquare size={14} />,
            badge: pendingCount,
          },
          {
            href: "/sermoes/pastores",
            label: "Pastores",
            icon: <Users size={14} />,
          },
        ]
      : []),
  ];

  return (
    <main className="min-h-screen bg-linen">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Top row */}
          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
            <Link className="inline-flex items-center gap-3" href="/sermoes">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-olive text-white sm:h-10 sm:w-10">
                <BookOpen size={18} />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-olive sm:text-sm">
                  Servos Fiéis
                </span>
                <span className="text-base font-semibold text-ink sm:text-xl">
                  Recursos úteis para o pregador
                </span>
              </span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {(admin || approved) && (
                <Link
                  href="/sermoes/novo"
                  className="inline-flex items-center gap-1.5 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-olive/40 hover:text-olive"
                >
                  <Plus size={16} />
                  <span className="hidden xs:inline">Novo sermão</span>
                  <span className="xs:hidden">Novo</span>
                </Link>
              )}
              {!admin && (
                <Link
                  href="/pastores/perfil"
                  className="inline-flex items-center gap-1.5 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-olive/40 hover:text-olive"
                >
                  <UserCircle size={16} />
                  <span className="hidden sm:inline">{profileLabel}</span>
                  <span className="sm:hidden">Perfil</span>
                </Link>
              )}
              <form action="/logout" method="post">
                <button
                  className="inline-flex items-center gap-1.5 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink/70 transition hover:border-clay/40 hover:text-clay"
                  type="submit"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </form>
            </div>
          </div>

          {/* Tabs — client component for active state */}
          <TabNav tabs={tabs} />
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl">
        {children}
      </div>
    </main>
  );
}
