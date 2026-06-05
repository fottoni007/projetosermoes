import { redirect } from "next/navigation";
import { CheckCircle, Clock, User, XCircle } from "lucide-react";
import {
  approvePastorProfile,
  rejectPastorProfile,
  listPendingPastorProfiles,
} from "@/lib/pastor-profiles";
import { approveSermon, rejectSermon, listPendingSermons, getCurrentUser } from "@/lib/sermons";
import { isAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AprovarPage() {
  const user = await getCurrentUser();
  if (!user || !isAdminUser(user)) redirect("/sermoes");

  const [allProfiles, pendingSermons] = await Promise.all([
    listPendingPastorProfiles(),
    listPendingSermons(),
  ]);

  const pendingProfiles = allProfiles.filter((p) => p.status === "pending");

  return (
    <section className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6">

      {/* ── Perfis pendentes ── */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-xl font-bold text-ink sm:text-2xl">Perfis pendentes</h2>
          {pendingProfiles.length > 0 && (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-clay px-1.5 text-xs font-bold text-white">
              {pendingProfiles.length}
            </span>
          )}
        </div>

        {pendingProfiles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink/20 bg-white p-8 text-center text-sm text-ink/70">
            Nenhum perfil pendente. ✓
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingProfiles.map((profile) => (
              <div key={profile.id} className="rounded-xl border border-ink/10 bg-white p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-olive/10 text-olive">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{profile.full_name}</p>
                      <p className="text-sm text-ink/70">{profile.church_name}</p>
                      <p className="text-xs text-ink/70">{profile.address}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <Clock size={11} /> Pendente
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                  {[
                    ["Tipo", profile.pastor_type === "senior" ? "Pastor Sénior" : "Pastor Colaborador"],
                    ["Pastorado", `${profile.years_of_ministry} anos`],
                    ["Formação", profile.academic_background],
                    ["Email", profile.contact_email],
                    ["Telefone", `${profile.phone_country_code} ${profile.phone_number}`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs font-medium text-ink/70">{label}</dt>
                      <dd className="truncate text-ink/80">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 flex flex-wrap gap-3">
                  <form action={async () => { "use server"; await approvePastorProfile(profile.id); }}>
                    <button className="inline-flex items-center gap-2 rounded-md bg-olive px-4 py-2 text-sm font-semibold text-white transition hover:bg-olive/90" type="submit">
                      <CheckCircle size={15} /> Aprovar
                    </button>
                  </form>
                  <form action={async () => { "use server"; await rejectPastorProfile(profile.id); }}>
                    <button className="inline-flex items-center gap-2 rounded-md border border-clay/30 px-4 py-2 text-sm font-semibold text-clay transition hover:bg-clay/5" type="submit">
                      <XCircle size={15} /> Rejeitar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Sermões pendentes ── */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-xl font-bold text-ink sm:text-2xl">Sermões pendentes</h2>
          {pendingSermons.length > 0 && (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-clay px-1.5 text-xs font-bold text-white">
              {pendingSermons.length}
            </span>
          )}
        </div>

        {pendingSermons.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink/20 bg-white p-8 text-center text-sm text-ink/70">
            Nenhum sermão pendente. ✓
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingSermons.map((sermon) => (
              <div key={sermon.id} className="rounded-xl border border-ink/10 bg-white p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink">{sermon.title}</p>
                    <p className="text-sm text-ink/70">{sermon.preacher_name} · {sermon.series_theme}</p>
                    <p className="text-xs text-ink/70">{sermon.biblical_text} · {new Intl.DateTimeFormat("pt-PT").format(new Date(sermon.date))}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <Clock size={11} /> Pendente
                  </span>
                </div>
                {sermon.notes && (
                  <p className="mt-3 line-clamp-2 text-sm text-ink/70">{sermon.notes}</p>
                )}
                {sermon.ai_summary && (
                  <div className="mt-3 rounded-lg bg-olive/5 p-3">
                    <p className="mb-1 text-xs font-semibold text-olive">Resumo IA</p>
                    <p className="line-clamp-3 text-xs text-ink/70">{sermon.ai_summary}</p>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <form action={async () => { "use server"; await approveSermon(sermon.id); }}>
                    <button className="inline-flex items-center gap-2 rounded-md bg-olive px-4 py-2 text-sm font-semibold text-white transition hover:bg-olive/90" type="submit">
                      <CheckCircle size={15} /> Publicar
                    </button>
                  </form>
                  <form action={async () => { "use server"; await rejectSermon(sermon.id); }}>
                    <button className="inline-flex items-center gap-2 rounded-md border border-clay/30 px-4 py-2 text-sm font-semibold text-clay transition hover:bg-clay/5" type="submit">
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
