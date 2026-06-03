import { redirect } from "next/navigation";
import SermonForm from "@/components/sermon-form";
import { isAdminUser } from "@/lib/auth";
import { isApprovedPastor } from "@/lib/pastor-profiles";
import { createSermon, getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";

export default async function NewSermonPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const admin = isAdminUser(user);
  const approved = admin || (await isApprovedPastor());

  if (!approved) redirect("/pastores/perfil");

  return (
    <section className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-ink">Novo sermão</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          {admin
            ? "Guarda a mensagem, as notas pastorais e o PDF associado."
            : "O sermão ficará pendente de aprovação antes de ser publicado."}
        </p>
      </div>
      <SermonForm action={createSermon} submitLabel="Guardar sermão" />
    </section>
  );
}
