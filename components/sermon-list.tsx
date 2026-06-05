import { Calendar, Clock, FileText, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { sermonTypeLabel } from "@/lib/sermon-types";
import type { Sermon } from "@/types/sermon";

type SermonListProps = {
  sermons: Sermon[];
  query?: string;
  currentUserId?: string;
};

export default function SermonList({ sermons, query, currentUserId }: SermonListProps) {
  if (sermons.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink/20 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-ink sm:text-xl">
          {query ? "Nenhum sermão encontrado." : "Ainda não existem sermões."}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/70">
          {query
            ? "Tenta pesquisar com outras palavras."
            : "Cria o primeiro registo para começar a biblioteca."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {sermons.map((sermon) => (
        <Link
          className="block rounded-xl border border-ink/10 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-olive/35 sm:p-5"
          href={`/sermoes/${sermon.id}`}
          key={sermon.id}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-ink sm:text-lg">{sermon.title}</h2>
                {sermonTypeLabel(sermon.sermon_type) && (
                  <span className="inline-flex items-center rounded-full bg-ink/5 px-2 py-0.5 text-xs font-semibold text-ink/70">
                    {sermonTypeLabel(sermon.sermon_type)}
                  </span>
                )}
                {sermon.status === "pending" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                    <Clock size={10} /> Aguarda aprovação
                  </span>
                )}
                {sermon.ai_summary && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-olive/10 px-2 py-0.5 text-xs font-semibold text-olive">
                    <Sparkles size={10} /> Resumo IA
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-ink/70 line-clamp-1">{sermon.series_theme}</p>
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-olive">
                <UserRound size={13} />
                {sermon.preacher_name}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-mist px-2.5 py-1.5 text-xs font-medium text-ink/70 sm:text-sm">
              <Calendar size={13} />
              {new Intl.DateTimeFormat("pt-PT").format(new Date(sermon.date))}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink/70 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <FileText size={13} />
              {sermon.biblical_text}
            </span>
            {sermon.pdf_path && (
              <span className="rounded-md bg-olive/10 px-2 py-0.5 text-xs font-semibold text-olive">
                PDF
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
