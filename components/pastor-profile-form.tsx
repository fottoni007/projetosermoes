"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { savePastorProfile } from "@/lib/pastor-profiles";
import { pastorProfileSchema, type PastorProfileInput } from "@/lib/validations";
import type { PastorProfile, PastorProfileFormState } from "@/types/pastor";

const COUNTRY_CODES = [
  { code: "+351", label: "+351 🇵🇹 Portugal" },
  { code: "+55", label: "+55 🇧🇷 Brasil" },
  { code: "+244", label: "+244 🇦🇴 Angola" },
  { code: "+258", label: "+258 🇲🇿 Moçambique" },
  { code: "+238", label: "+238 🇨🇻 Cabo Verde" },
  { code: "+239", label: "+239 🇸🇹 S. Tomé e Príncipe" },
  { code: "+245", label: "+245 🇬🇼 Guiné-Bissau" },
  { code: "+1", label: "+1 🇺🇸 EUA/Canadá" },
  { code: "+44", label: "+44 🇬🇧 Reino Unido" },
  { code: "+34", label: "+34 🇪🇸 Espanha" },
  { code: "+33", label: "+33 🇫🇷 França" },
  { code: "+49", label: "+49 🇩🇪 Alemanha" },
  { code: "+39", label: "+39 🇮🇹 Itália" },
];

const initialState: PastorProfileFormState = { message: "" };

export default function PastorProfileForm({ existing }: { existing?: PastorProfile }) {
  const [state, formAction, isPending] = useActionState(savePastorProfile, initialState);
  const { register, formState: { errors } } = useForm<PastorProfileInput>({
    resolver: zodResolver(pastorProfileSchema),
    defaultValues: {
      full_name: existing?.full_name ?? "",
      church_name: existing?.church_name ?? "",
      address: existing?.address ?? "",
      years_of_ministry: existing?.years_of_ministry ?? 0,
      pastor_type: existing?.pastor_type ?? "senior",
      academic_background: existing?.academic_background ?? "",
      instagram_url: existing?.instagram_url ?? "",
      facebook_url: existing?.facebook_url ?? "",
      youtube_url: existing?.youtube_url ?? "",
      phone_country_code: existing?.phone_country_code ?? "+351",
      phone_number: existing?.phone_number ?? "",
      contact_email: existing?.contact_email ?? "",
    },
  });

  function fe(name: keyof PastorProfileInput) {
    return errors[name]?.message ?? state.errors?.[name]?.[0];
  }

  const inputClass = "mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10";
  const err = "mt-1 block text-xs text-clay";

  return (
    <form action={formAction} className="space-y-6">

      {/* Informação Pessoal */}
      <fieldset className="rounded-xl border border-ink/10 bg-white p-5 shadow-soft sm:p-6">
        <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-ink/60">Informação Pessoal</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-ink">Nome completo *</span>
            <input className={inputClass} {...register("full_name")} name="full_name" />
            {fe("full_name") && <span className={err}>{fe("full_name")}</span>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Email de contacto *</span>
            <input className={inputClass} {...register("contact_email")} name="contact_email" type="email" />
            {fe("contact_email") && <span className={err}>{fe("contact_email")}</span>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Contacto telefónico *</span>
            <div className="mt-2 flex gap-2">
              <select
                className="w-32 shrink-0 rounded-md border border-ink/15 bg-white px-2 py-2 text-xs outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10 sm:w-auto"
                {...register("phone_country_code")} name="phone_country_code"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <input
                className="min-w-0 flex-1 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
                {...register("phone_number")} name="phone_number" placeholder="912 345 678" type="tel"
              />
            </div>
            {fe("phone_number") && <span className={err}>{fe("phone_number")}</span>}
          </label>
        </div>
      </fieldset>

      {/* Informação Pastoral */}
      <fieldset className="rounded-xl border border-ink/10 bg-white p-5 shadow-soft sm:p-6">
        <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-ink/60">Informação Pastoral</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-ink">Nome da igreja *</span>
            <input className={inputClass} {...register("church_name")} name="church_name" />
            {fe("church_name") && <span className={err}>{fe("church_name")}</span>}
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-ink">Morada da igreja *</span>
            <input className={inputClass} {...register("address")} name="address" placeholder="Rua, nº, cidade, país" />
            {fe("address") && <span className={err}>{fe("address")}</span>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Anos de pastorado *</span>
            <input className={inputClass} {...register("years_of_ministry", { valueAsNumber: true })} name="years_of_ministry" type="number" min="0" max="80" />
            {fe("years_of_ministry") && <span className={err}>{fe("years_of_ministry")}</span>}
          </label>

          <div>
            <span className="text-sm font-medium text-ink">Tipo de pastor *</span>
            <div className="mt-3 flex flex-wrap gap-5">
              {[{ value: "senior", label: "Pastor Sénior" }, { value: "colaborador", label: "Pastor Colaborador" }].map(({ value, label }) => (
                <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input className="h-4 w-4 accent-olive" {...register("pastor_type")} name="pastor_type" type="radio" value={value} />
                  {label}
                </label>
              ))}
            </div>
            {fe("pastor_type") && <span className={err}>{fe("pastor_type")}</span>}
          </div>

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-ink">Formação académica *</span>
            <input className={inputClass} {...register("academic_background")} name="academic_background" placeholder="Ex.: Licenciatura em Teologia — Seminário..." />
            {fe("academic_background") && <span className={err}>{fe("academic_background")}</span>}
          </label>
        </div>
      </fieldset>

      {/* Redes Sociais */}
      <fieldset className="rounded-xl border border-ink/10 bg-white p-5 shadow-soft sm:p-6">
        <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-ink/60">
          Redes Sociais <span className="font-normal normal-case text-ink/40">(opcional)</span>
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { name: "instagram_url" as const, label: "Instagram", placeholder: "https://instagram.com/..." },
            { name: "facebook_url" as const, label: "Facebook", placeholder: "https://facebook.com/..." },
            { name: "youtube_url" as const, label: "YouTube", placeholder: "https://youtube.com/@..." },
          ].map(({ name, label, placeholder }) => (
            <label key={name} className="block">
              <span className="text-sm font-medium text-ink">{label}</span>
              <input className={inputClass} {...register(name)} name={name} type="url" placeholder={placeholder} />
              {fe(name) && <span className={err}>{fe(name)}</span>}
            </label>
          ))}
        </div>
      </fieldset>

      {state.message && (
        <p className={`rounded-lg px-4 py-3 text-sm font-medium ${state.success ? "bg-olive/10 text-olive" : "bg-clay/10 text-clay"}`}>
          {state.message}
        </p>
      )}

      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-olive px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-olive/90 disabled:opacity-60 sm:w-auto"
        disabled={isPending}
        type="submit"
      >
        <Save size={17} />
        {isPending ? "A guardar…" : existing ? "Actualizar perfil" : "Submeter perfil"}
      </button>
    </form>
  );
}
