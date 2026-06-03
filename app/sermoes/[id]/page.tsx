import { Calendar, Download, FileText, UserRound } from "lucide-react";
import SermonForm from "@/components/sermon-form";
import { isAdminUser } from "@/lib/auth";
import { getCurrentUser, getPdfUrl, getSermon, updateSermon } from "@/lib/sermons";

type SermonPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SermonPage({ params }: SermonPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  const isAdmin = isAdminUser(user);
  const sermon = await getSermon(id);
  const pdfUrl = await getPdfUrl(sermon.pdf_path);
  const updateAction = updateSermon.bind(null, sermon.id);

  return (
    <section
      className={`mx-auto grid max-w-6xl gap-8 px-6 py-8 ${
        isAdmin ? "lg:grid-cols-[0.95fr_1.05fr]" : ""
      }`}
    >
      <article className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-olive">
              Sermão
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-ink">{sermon.title}</h1>
          </div>
          {pdfUrl ? (
            <a
              className="inline-flex items-center justify-center gap-2 rounded-md bg-olive px-3 py-2 text-sm font-semibold text-white transition hover:bg-olive/90"
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Download size={17} />
              Abrir PDF
            </a>
          ) : null}
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md bg-mist/70 p-4">
            <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Calendar size={16} />
              Data
            </dt>
            <dd className="mt-2 text-ink/75">
              {new Intl.DateTimeFormat("pt-PT").format(new Date(sermon.date))}
            </dd>
          </div>
          <div className="rounded-md bg-mist/70 p-4">
            <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
              <UserRound size={16} />
              Pregador
            </dt>
            <dd className="mt-2 text-ink/75">{sermon.preacher_name}</dd>
          </div>
          <div className="rounded-md bg-mist/70 p-4">
            <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
              <FileText size={16} />
              Texto bíblico
            </dt>
            <dd className="mt-2 text-ink/75">{sermon.biblical_text}</dd>
          </div>
        </dl>

        <div className="mt-6 rounded-md bg-olive/10 p-4">
          <h2 className="text-sm font-semibold text-olive">Tema da série</h2>
          <p className="mt-2 text-ink">{sermon.series_theme}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-ink">Notas</h2>
          <p className="mt-3 whitespace-pre-wrap leading-7 text-ink/75">{sermon.notes}</p>
        </div>
      </article>

      {isAdmin ? (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-ink">Editar sermão</h2>
          <SermonForm
            action={updateAction}
            initialValues={sermon}
            submitLabel="Actualizar sermão"
          />
        </div>
      ) : null}
    </section>
  );
}
