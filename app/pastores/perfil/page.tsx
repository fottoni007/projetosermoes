import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import PastorProfileForm from "@/components/pastor-profile-form";
import { getMyPastorProfile } from "@/lib/pastor-profiles";
import { getCurrentUser } from "@/lib/sermons";
import { isAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PastorProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (isAdminUser(user)) redirect("/sermoes");

  const profile = await getMyPastorProfile();

  return (
    <main className="min-h-screen bg-linen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">

        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/sermoes"
            className="inline-flex items-center gap-2 text-sm text-ink/70 transition hover:text-olive"
          >
            <ArrowLeft size={15} />
            Voltar à página principal
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Perfil de Pastor</h1>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Preenche o teu perfil para poderes submeter sermões. Após a submissão, o perfil será analisado pelo administrador.
          </p>
        </div>

        {/* Status banners */}
        {profile?.status === "pending" && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <Clock className="mt-0.5 shrink-0 text-amber-600" size={18} />
            <p className="text-sm text-amber-800">
              O teu perfil foi submetido e aguarda aprovação. Receberás uma resposta em breve.
            </p>
          </div>
        )}
        {profile?.status === "approved" && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <CheckCircle className="mt-0.5 shrink-0 text-green-600" size={18} />
            <p className="text-sm text-green-800">
              O teu perfil está aprovado. Podes submeter e editar sermões. Se actualizares o perfil, precisarás de nova aprovação.
            </p>
          </div>
        )}
        {profile?.status === "rejected" && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <XCircle className="mt-0.5 shrink-0 text-red-600" size={18} />
            <p className="text-sm text-red-800">
              {profile.rejection_reason ?? "O teu perfil não foi aprovado."}
            </p>
          </div>
        )}

        {/* Always show form (edit allowed even if approved) */}
        <PastorProfileForm existing={profile ?? undefined} />

        {/* Bottom back button */}
        <div className="mt-8">
          <Link
            href="/sermoes"
            className="inline-flex items-center gap-2 text-sm text-ink/70 transition hover:text-olive"
          >
            <ArrowLeft size={15} />
            Voltar à página principal
          </Link>
        </div>
      </div>
    </main>
  );
}
