"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Upload } from "lucide-react";
import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { sermonSchema, type SermonInput } from "@/lib/validations";
import { SERMON_TYPE_OPTIONS } from "@/lib/sermon-types";
import type { Sermon, SermonFormState } from "@/types/sermon";

const FORM_ID = "sermon-edit-form";

type SermonFormProps = {
  action: (prev: SermonFormState, formData: FormData) => Promise<SermonFormState>;
  initialValues?: Sermon;
  submitLabel: string;
  deleteButton?: React.ReactNode;
};

const initialState: SermonFormState = { message: "" };

const inputClass =
  "mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10";
const labelTextClass = "text-sm font-medium text-ink";
const errorClass = "mt-1 block text-sm text-clay";

export default function SermonForm({
  action,
  initialValues,
  submitLabel,
  deleteButton,
}: SermonFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [fileName, setFileName] = useState<string>(
    initialValues?.pdf_path ? "PDF já anexado" : ""
  );
  const [isSeries, setIsSeries] = useState<boolean>(initialValues?.is_series ?? false);

  const {
    register,
    formState: { errors },
  } = useForm<SermonInput>({
    resolver: zodResolver(sermonSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      preacher_name: initialValues?.preacher_name ?? "",
      date: initialValues?.date ?? "",
      biblical_text: initialValues?.biblical_text ?? "",
      is_series: initialValues?.is_series ?? false,
      series_theme: initialValues?.series_theme ?? "",
      notes: initialValues?.notes ?? "",
    },
  });

  function fe(name: keyof SermonInput) {
    return errors[name]?.message ?? state.errors?.[name]?.[0];
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-soft sm:p-6">
      <form id={FORM_ID} action={formAction}>
        <div className="grid gap-5 sm:grid-cols-2">

          <label className="block sm:col-span-2">
            <span className={labelTextClass}>Título *</span>
            <input className={inputClass} {...register("title")} name="title" required />
            {fe("title") && <span className={errorClass}>{fe("title")}</span>}
          </label>

          <label className="block sm:col-span-2">
            <span className={labelTextClass}>Nome do Pregador *</span>
            <input className={inputClass} {...register("preacher_name")} name="preacher_name" required />
            {fe("preacher_name") && <span className={errorClass}>{fe("preacher_name")}</span>}
          </label>

          <label className="block">
            <span className={labelTextClass}>Data *</span>
            <input className={inputClass} {...register("date")} name="date" type="date" required />
            {fe("date") && <span className={errorClass}>{fe("date")}</span>}
          </label>

          <label className="block">
            <span className={labelTextClass}>Texto bíblico principal *</span>
            <input
              className={inputClass}
              {...register("biblical_text")}
              name="biblical_text"
              placeholder="Ex.: João 15:1-8"
              required
            />
            {fe("biblical_text") && <span className={errorClass}>{fe("biblical_text")}</span>}
          </label>

          <label className="block sm:col-span-2">
            <span className={labelTextClass}>Tipo de sermão *</span>
            <select
              className={inputClass}
              name="sermon_type"
              defaultValue={initialValues?.sermon_type ?? ""}
              required
            >
              <option value="" disabled>Seleccione o tipo…</option>
              {SERMON_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {fe("sermon_type") && <span className={errorClass}>{fe("sermon_type")}</span>}
          </label>

          {/* Tipo: série ou tema único */}
          <div className="sm:col-span-2">
            <span className={labelTextClass}>Esta mensagem é *</span>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-5">
              <label className={`flex flex-1 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                isSeries ? "border-olive bg-olive/5 text-olive" : "border-ink/15 text-ink/70"
              }`}>
                <input
                  type="radio"
                  name="is_series"
                  value="true"
                  className="h-4 w-4 accent-olive"
                  checked={isSeries}
                  onChange={() => setIsSeries(true)}
                />
                Parte de uma série
              </label>
              <label className={`flex flex-1 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                !isSeries ? "border-olive bg-olive/5 text-olive" : "border-ink/15 text-ink/70"
              }`}>
                <input
                  type="radio"
                  name="is_series"
                  value="false"
                  className="h-4 w-4 accent-olive"
                  checked={!isSeries}
                  onChange={() => setIsSeries(false)}
                />
                Tema único
              </label>
            </div>
          </div>

          {/* Nome da série OU tema, conforme a escolha acima */}
          <label className="block sm:col-span-2">
            <span className={labelTextClass}>
              {isSeries ? "Nome da série *" : "Tema da mensagem *"}
            </span>
            <input
              className={inputClass}
              {...register("series_theme")}
              name="series_theme"
              placeholder={isSeries ? "Ex.: Fruto do Espírito" : "Ex.: Gratidão"}
              required
            />
            {fe("series_theme") && <span className={errorClass}>{fe("series_theme")}</span>}
          </label>

          <label className="block sm:col-span-2">
            <span className={labelTextClass}>Notas *</span>
            <textarea
              className={`${inputClass} min-h-36 leading-7`}
              {...register("notes")}
              name="notes"
              required
            />
            {fe("notes") && <span className={errorClass}>{fe("notes")}</span>}
          </label>

          {/* PDF Upload */}
          <div className="block sm:col-span-2">
            <span className={labelTextClass}>
              Ficheiro PDF *{" "}
              <span className="font-normal text-ink/50">(obrigatório, máx. 15 MB)</span>
            </span>
            <label className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink/20 bg-mist/40 px-4 py-5 text-center text-sm text-ink/65 transition hover:border-olive/50 hover:bg-olive/5">
              <Upload className="mb-2 text-olive" size={22} />
              {fileName ? (
                <span className="font-medium text-olive">{fileName}</span>
              ) : (
                <span>Clica para seleccionar um PDF</span>
              )}
              <input
                className="sr-only"
                name="pdf"
                type="file"
                accept="application/pdf"
                required={!initialValues?.pdf_path}
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </label>
            {fe("pdf") && <span className={errorClass}>{fe("pdf")}</span>}
            <p className="mt-1.5 text-xs text-ink/45">
              O PDF será verificado contra malware e analisado por IA. PDFs com hiperlinks não são aceites.
            </p>
          </div>
        </div>

        {state.message && (
          <p
            className={`mt-5 rounded-md px-3 py-2.5 text-sm ${
              state.message.includes("sucesso") || state.message.includes("aprovação")
                ? "bg-olive/10 text-olive"
                : "bg-clay/10 text-clay"
            }`}
          >
            {state.message}
          </p>
        )}
      </form>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          form={FORM_ID}
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive/90 disabled:opacity-60"
        >
          <Save size={17} />
          {isPending ? "A verificar e guardar…" : submitLabel}
        </button>
        {deleteButton}
      </div>
    </div>
  );
}
