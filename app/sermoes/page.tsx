import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { isAdminUser } from "@/lib/auth";
import { isApprovedPastor } from "@/lib/pastor-profiles";
import { getCurrentUser, listSermons } from "@/lib/sermons";
import SermonList from "@/components/sermon-list";
import SearchBox from "@/components/search-box";

export const dynamic = "force-dynamic";

type SermonsPageProps = {
  searchParams: Promise<{ q?: string; pagina?: string }>;
};

function pageHref(query: string | undefined, page: number) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("pagina", String(page));
  const qs = params.toString();
  return qs ? `/sermoes?${qs}` : "/sermoes";
}

export default async function SermonsPage({ searchParams }: SermonsPageProps) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(params.pagina ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const [result, user] = await Promise.all([
    listSermons(params.q, page),
    getCurrentUser(),
  ]);

  const canCreate = isAdminUser(user) || (await isApprovedPastor());

  const { sermons, total, pageSize } = result;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(result.page, totalPages);

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

      <SermonList query={params.q} sermons={sermons} canCreate={canCreate} />

      {totalPages > 1 && (
        <nav
          className="mt-6 flex items-center justify-between gap-3 text-sm"
          aria-label="Paginação de sermões"
        >
          {currentPage > 1 ? (
            <Link
              href={pageHref(params.q, currentPage - 1)}
              rel="prev"
              className="inline-flex items-center gap-1.5 rounded-md border border-ink/15 bg-white px-3 py-2 font-semibold text-ink transition hover:border-olive/40 hover:text-olive"
            >
              <ChevronLeft size={16} />
              Anterior
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-ink/10 px-3 py-2 font-semibold text-ink/35">
              <ChevronLeft size={16} />
              Anterior
            </span>
          )}

          <span className="tabular-nums text-ink/70">
            Página {currentPage} de {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={pageHref(params.q, currentPage + 1)}
              rel="next"
              className="inline-flex items-center gap-1.5 rounded-md border border-ink/15 bg-white px-3 py-2 font-semibold text-ink transition hover:border-olive/40 hover:text-olive"
            >
              Seguinte
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-ink/10 px-3 py-2 font-semibold text-ink/35">
              Seguinte
              <ChevronRight size={16} />
            </span>
          )}
        </nav>
      )}
    </section>
  );
}
