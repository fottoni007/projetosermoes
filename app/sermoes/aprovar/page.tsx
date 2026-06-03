import { redirect } from "next/navigation";
import { CheckCircle, Clock, User, XCircle } from "lucide-react";
import {
  approvePastorProfile,
  rejectPastorProfile,
  listPendingPastorProfiles,
} from "@/lib/pastor-profiles";
import { approveSermon, rejectSermon, listPendingSermons } from "@/lib/sermons";
import { getCurrentUser } from "@/lib/sermons";
import { isAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AprovarPage() {
  const user = await getCurrentUser();
  if (!user || !isAdminUser(user)) redirect("/sermoes");

  const [profiles, sermons] = await Promise.all([
    listPendingPastorProfiles(),
    listPendingSermons(),
  ]);

  const pendingProfiles = profiles.filter((p) => p.status === "pending");
  const pendingSermons = sermons;

  return (
    <section className="mx-auto max-w-4xl px-6 py-8 space-y-10">

      {/* Pastor Profiles */}
      <div>
        <h2 className="text-2xl font-semibold text-ink">
          Perfis de pastor
          {pendingProfiles.length > 0 && (
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-clay text-xs font-bold text-white">
              {pendingProfiles.length}
            </span>
          )}
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Perfis submetidos por pastores que aguardam a tua aprovação.
        </p>

        {pendingProfiles.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-ink/20 bg-white p-8 text-center text-sm text-ink/50">
            Nenhum perfil pendente.
          </div>
        ) : (
          <div className="mt-4 grid gap-4">
            {pendingProfiles.map((profile) => (
              <div key={profile.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-olive/10 text-olive">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{profile.full_name}</p>
                      <p className="text-sm text-ink/65">{profile.church_name}</p>
                      <p className="text-xs text-ink/45">{profile.address}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <Clock size={11} /> Pendente
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                  {[
                    ["Tipo", profile.pastor_type === "senior" ? "Pastor Sénior" : "Pastor Colaborador"],
                    ["Pastorado", `${profile.years_of_ministry} anos`],
                    ["Formação", profile.academic_background],
                    ["Email", profile.contact_email],
                    ["Telefone", `${profile.phone_country_code} ${profile.phone_number}`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs font-medium text-ink/45">{label}</dt>
                      <dd className="text-ink/80">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 flex gap-3">
                  <form action={async () => { "use server"; await approvePastorProfile(profile.id); }}>
                    <button
                      className="inline-flex items-center gap-2 rounded-md bg-olive px-4 py-2 text-sm font-semibold text-white transition hover:bg-olive/90"
                      type="submit"
                    >
                      <CheckCircle size={15} /> Aprovar
                    </button>
                  </form>
                  <form action={async () => { "use server"; await rejectPastorProfile(profile.id); }}>
                    <button
                      className="inline-flex items-center gap-2 rounded-md border border-clay/30 px-4 py-2 text-sm font-semibold text-clay transition hover:bg-clay/5"
                      type="submit"
                    >
                      <XCircle size={15} /> Rejeitar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sermons */}
      <div>
        <h2 className="text-2xl font-semibold text-ink">
          Sermões
          {pendingSermons.length > 0 && (
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-clay text-xs font-bold text-white">
              {pendingSermons.length}
            </span>
          )}
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Sermões submetidos por pastores que aguardam publicação.
        </p>

        {pendingSermons.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-ink/20 bg-white p-8 text-center text-sm text-ink/50">
            Nenhum sermão pendente.
          </div>
        ) : (
          <div className="mt-4 grid gap-4">
            {pendingSermons.map((sermon) => (
              <div key={sermon.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-ink">{sermon.title}</p>
                    <p className="text-sm text-ink/65">{sermon.preacher_name} · {sermon.series_theme}</p>
                    <p className="text-xs text-ink/45">{sermon.biblical_text} · {new Intl.DateTimeFormat("pt-PT").format(new Date(sermon.date))}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <Clock size={11} /> Pendente
                  </span>
                </div>

                {sermon.notes && (
                  <p className="mt-3 line-clamp-2 text-sm text-ink/60">{sermon.notes}</p>
                )}

                <div className="mt-4 flex gap-3">
                  <form action={async () => { "use server"; await approveSermon(sermon.id); }}>
                    <button
                      className="inline-flex items-center gap-2 rounded-md bg-olive px-4 py-2 text-sm font-semibold text-white transition hover:bg-olive/90"
                      type="submit"
                    >
                      <CheckCircle size={15} /> Publicar
                    </button>
                  </form>
                  <form action={async () => { "use server"; await rejectSermon(sermon.id); }}>
                    <button
                      className="inline-flex items-center gap-2 rounded-md border border-clay/30 px-4 py-2 text-sm font-semibold text-clay transition hover:bg-clay/5"
                      type="submit"
                    >
                      <XCircle size={15} /> Rejeitar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
  );
}
