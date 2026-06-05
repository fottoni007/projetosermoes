import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import SermonForm from "@/components/sermon-form";
import { isAdminUser } from "@/lib/auth";
import { isApprovedPastor } from "@/lib/pastor-profiles";
import { createSermon, getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function NewSermonPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const admin = isAdminUser(user);
  const approved = admin || (await isApprovedPastor());
  if (!approved) redirect("/pastores/perfil");

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/sermoes"
          className="inline-flex items-center gap-1.5 text-sm text-ink/70 transition hover:text-olive"
        >
          <ArrowLeft size={15} />
          Voltar
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Novo sermão</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          {admin
            ? "Todos os campos são obrigatórios. O PDF será analisado por IA."
            : "O sermão ficará pendente de aprovação. Todos os campos e o PDF são obrigatórios."}
        </p>
      </div>
      <SermonForm action={createSermon} submitLabel="Guardar sermão" />
    </section>
  );
}
