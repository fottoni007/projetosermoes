import { redirect } from "next/navigation";
import SermonForm from "@/components/sermon-form";
import { isAdminUser } from "@/lib/auth";
import { createSermon, getCurrentUser } from "@/lib/sermons";

export default async function NewSermonPage() {
  const user = await getCurrentUser();

  if (!isAdminUser(user)) {
    redirect("/sermoes");
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-ink">Novo sermão</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Guarda a mensagem, as notas pastorais e o PDF associado.
        </p>
      </div>
      <SermonForm action={createSermon} submitLabel="Guardar sermão" />
    </section>
  );
}
