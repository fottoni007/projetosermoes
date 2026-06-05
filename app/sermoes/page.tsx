import { getCurrentUser } from "@/lib/sermons";
import { isAdminUser } from "@/lib/auth";
import { listSermons } from "@/lib/sermons";
import SermonList from "@/components/sermon-list";
import SearchBox from "@/components/search-box";

export const dynamic = "force-dynamic";

type SermonsPageProps = { searchParams: Promise<{ q?: string }> };

export default async function SermonsPage({ searchParams }: SermonsPageProps) {
  const params = await searchParams;
  const [sermons, user] = await Promise.all([listSermons(params.q), getCurrentUser()]);

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Biblioteca de sermões</h1>
          <p className="mt-1.5 text-sm leading-6 text-ink/70">
            Pesquisa por título, passagem bíblica, tema da série ou notas.
          </p>
        </div>
        <SearchBox defaultValue={params.q ?? ""} />
      </div>
      <SermonList query={params.q} sermons={sermons} currentUserId={user?.id} />
    </section>
  );
}
