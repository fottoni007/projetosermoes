import { listSermons } from "@/lib/sermons";
import SermonList from "@/components/sermon-list";
import SearchBox from "@/components/search-box";

export const dynamic = "force-dynamic";

type SermonsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SermonsPage({ searchParams }: SermonsPageProps) {
  const params = await searchParams;
  const sermons = await listSermons(params.q);

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Biblioteca de sermões</h1>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Pesquisa mensagens por título, passagem bíblica, tema da série ou notas.
          </p>
        </div>
        <SearchBox defaultValue={params.q ?? ""} />
      </div>

      <SermonList query={params.q} sermons={sermons} />
    </section>
  );
}
