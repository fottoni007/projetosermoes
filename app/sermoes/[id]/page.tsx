import { ArrowLeft, BookOpen, Calendar, Edit, FileText, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DeleteSermonButton from "@/components/delete-sermon-button";
import { isAdminUser } from "@/lib/auth";
import { getCurrentUser, getSermon, getPdfUrl, deleteSermon } from "@/lib/sermons";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Props = { params: Promise<{ id: string }> };

export default async function SermonDetailPage({ params }: Props) {
  const { id } = await params;
  const [user, sermon] = await Promise.all([getCurrentUser(), getSermon(id).catch(() => null)]);

  if (!user) redirect("/login");
  if (!sermon) notFound();

  const admin = isAdminUser(user);
  const isAuthor = sermon.created_by === user.id;
  const canEdit = admin || isAuthor;

  if (sermon.status !== "published" && !canEdit) notFound();

  const pdfUrl = await getPdfUrl(sermon.pdf_path);

  const statusMap: Record<string, { label: string; className: string }> = {
    pending: { label: "Aguarda aprovação", className: "bg-amber-100 text-amber-700" },
    published: { label: "Publicado", className: "bg-green-100 text-green-700" },
    rejected: { label: "Rejeitado", className: "bg-red-100 text-red-700" },
  };
  const statusInfo = statusMap[sermon.status];

  const deleteAction = deleteSermon.bind(null, id);

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">

      {/* Back + Actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/sermoes"
          className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink/70 transition hover:border-olive/30 hover:text-olive"
        >
          <ArrowLeft size={16} />
          Voltar aos sermões
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {sermon.status !== "published" && (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          )}
          {canEdit && (
            <>
              <Link
                href={`/sermoes/${sermon.id}/editar`}
                className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-olive/30 hover:text-olive"
              >
                <Edit size={15} />
                Editar
              </Link>
              <DeleteSermonButton action={deleteAction} />
            </>
          )}
        </div>
      </div>

      {/* Header card */}
      <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{sermon.title}</h1>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/65">
          <span className="inline-flex items-center gap-1.5">
            <UserRound size={15} className="text-olive" />
            {sermon.preacher_name}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={15} className="text-olive" />
            {new Intl.DateTimeFormat("pt-PT", { dateStyle: "long" }).format(new Date(sermon.date))}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={15} className="text-olive" />
            {sermon.biblical_text}
          </span>
        </div>
        <div className="mt-3">
          <span className="inline-block rounded-md bg-olive/10 px-2.5 py-1 text-xs font-semibold text-olive">
            {sermon.series_theme}
          </span>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-5 rounded-xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
        <h2 className="mb-3 text-lg font-semibold text-ink">Notas</h2>
        <p className="whitespace-pre-wrap leading-7 text-ink/80">{sermon.notes}</p>
      </div>

      {/* AI Summary */}
      {sermon.ai_summary && (
        <div className="mt-5 rounded-xl border border-olive/20 bg-olive/5 p-6 shadow-soft sm:p-8">
          <h2 className="mb-3 inline-flex items-center gap-2 text-lg font-semibold text-olive">
            <Sparkles size={18} />
            Resumo gerado por IA
          </h2>
          <p className="whitespace-pre-wrap leading-7 text-ink/80">{sermon.ai_summary}</p>
        </div>
      )}

      {/* PDF */}
      {pdfUrl && (
        <div className="mt-5 rounded-xl border border-ink/10 bg-white p-5 shadow-soft">
          <h2 className="mb-3 inline-flex items-center gap-2 text-lg font-semibold text-ink">
            <FileText size={18} />
            Ficheiro PDF
          </h2>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive/90"
          >
            <FileText size={16} />
            Descarregar PDF
          </a>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/sermoes"
          className="inline-flex items-center gap-2 text-sm text-ink/50 transition hover:text-olive"
        >
          <ArrowLeft size={15} />
          Voltar à lista de sermões
        </Link>
      </div>
    </section>
  );
}
