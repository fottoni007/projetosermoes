import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DeleteSermonButton from "@/components/delete-sermon-button";
import SermonForm from "@/components/sermon-form";
import { isAdminUser } from "@/lib/auth";
import { deleteSermonAction } from "@/lib/delete-sermon-action";
import { getCurrentUser, getSermon, updateSermon } from "@/lib/sermons";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Props = { params: Promise<{ id: string }> };

export default async function EditSermonPage({ params }: Props) {
  const { id } = await params;
  const [user, sermon] = await Promise.all([
    getCurrentUser(),
    getSermon(id).catch(() => null),
  ]);

  if (!user) redirect("/login");
  if (!sermon) notFound();

  const admin = isAdminUser(user);
  const isAuthor = sermon.created_by === user.id;

  if (!admin && !isAuthor) redirect("/sermoes");

  const updateAction = updateSermon.bind(null, id);
  // Usa o ficheiro dedicado com "use server" no topo — garante registo correcto
  const deleteAction = deleteSermonAction.bind(null, id);

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/sermoes/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-ink/70 transition hover:text-olive"
        >
          <ArrowLeft size={15} />
          Voltar ao sermão
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Editar sermão</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Actualiza os dados do sermão. Se enviares um novo PDF, será verificado e analisado por IA.
        </p>
      </div>

      <SermonForm
        action={updateAction}
        initialValues={sermon}
        submitLabel="Guardar alterações"
        deleteButton={<DeleteSermonButton action={deleteAction} />}
      />
    </section>
  );
}
