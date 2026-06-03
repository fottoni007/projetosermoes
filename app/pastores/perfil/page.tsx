import { redirect } from "next/navigation";
import { CheckCircle, Clock, XCircle } from "lucide-react";
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
    <main className="min-h-screen bg-linen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-ink">Perfil de Pastor</h1>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            Preenche o teu perfil para poderes submeter sermões. Após a submissão,
            o perfil será analisado pelo administrador.
          </p>
        </div>

        {/* Status banner */}
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
              O teu perfil foi aprovado. Podes agora submeter sermões.
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

        {profile?.status === "approved" ? (
          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Os teus dados</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Nome", profile.full_name],
                ["Igreja", profile.church_name],
                ["Morada", profile.address],
                ["Tempo de pastorado", `${profile.years_of_ministry} anos`],
                ["Tipo", profile.pastor_type === "senior" ? "Pastor Sénior" : "Pastor Colaborador"],
                ["Formação", profile.academic_background],
                ["Contacto", `${profile.phone_country_code} ${profile.phone_number}`],
                ["Email", profile.contact_email],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-ink/50">{label}</dt>
                  <dd className="mt-0.5 text-sm text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <PastorProfileForm existing={profile ?? undefined} />
        )}
      </div>
    </main>
  );
}
