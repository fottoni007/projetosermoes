import { Calendar, Clock, FileText, UserRound } from "lucide-react";
import Link from "next/link";
import type { Sermon } from "@/types/sermon";

type SermonListProps = {
  sermons: Sermon[];
  query?: string;
  currentUserId?: string;
};

export default function SermonList({ sermons, query, currentUserId }: SermonListProps) {
  if (sermons.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-ink/20 bg-white p-10 text-center">
        <h2 className="text-xl font-semibold text-ink">
          {query ? "Não foram encontrados sermões." : "Ainda não existem sermões."}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/65">
          {query
            ? "Experimenta pesquisar por outro título, pregador, texto bíblico, tema da série ou nota."
            : "Cria o primeiro registo para começar a organizar a biblioteca pastoral."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {sermons.map((sermon) => (
        <Link
          className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-olive/35"
          href={`/sermoes/${sermon.id}`}
          key={sermon.id}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-ink">{sermon.title}</h2>
                {sermon.status === "pending" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    <Clock size={11} />
                    Aguarda aprovação
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-6 text-ink/65">{sermon.series_theme}</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-olive">
                <UserRound size={15} />
                {sermon.preacher_name}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-md bg-mist px-3 py-1.5 text-sm font-medium text-ink/75">
              <Calendar size={15} />
              {new Intl.DateTimeFormat("pt-PT").format(new Date(sermon.date))}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink/65">
            <span className="inline-flex items-center gap-2">
              <FileText size={15} />
              {sermon.biblical_text}
            </span>
            {sermon.pdf_path && (
              <span className="rounded-md bg-olive/10 px-2 py-1 text-xs font-semibold text-olive">
                PDF anexado
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
