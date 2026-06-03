"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Upload } from "lucide-react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { sermonSchema, type SermonInput } from "@/lib/validations";
import type { Sermon, SermonFormState } from "@/types/sermon";

type SermonFormProps = {
  action: (
    previousState: SermonFormState,
    formData: FormData
  ) => Promise<SermonFormState>;
  initialValues?: Sermon;
  submitLabel: string;
};

const initialState: SermonFormState = {
  message: ""
};

export default function SermonForm({
  action,
  initialValues,
  submitLabel
}: SermonFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const {
    register,
    formState: { errors }
  } = useForm<SermonInput>({
    resolver: zodResolver(sermonSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      preacher_name: initialValues?.preacher_name ?? "",
      date: initialValues?.date ?? "",
      biblical_text: initialValues?.biblical_text ?? "",
      series_theme: initialValues?.series_theme ?? "",
      notes: initialValues?.notes ?? ""
    }
  });

  function fieldError(name: keyof SermonInput) {
    return errors[name]?.message ?? state.errors?.[name]?.[0];
  }

  return (
    <form action={formAction} className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-ink">Título</span>
          <input
            className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
            {...register("title")}
            name="title"
            required
          />
          {fieldError("title") ? (
            <span className="mt-1 block text-sm text-clay">{fieldError("title")}</span>
          ) : null}
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-ink">Nome do Pregador</span>
          <input
            className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
            {...register("preacher_name")}
            name="preacher_name"
            required
          />
          {fieldError("preacher_name") ? (
            <span className="mt-1 block text-sm text-clay">
              {fieldError("preacher_name")}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink">Data</span>
          <input
            className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
            {...register("date")}
            name="date"
            type="date"
            required
          />
          {fieldError("date") ? (
            <span className="mt-1 block text-sm text-clay">{fieldError("date")}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink">Texto bíblico</span>
          <input
            className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
            {...register("biblical_text")}
            name="biblical_text"
            placeholder="Ex.: João 15:1-8"
            required
          />
          {fieldError("biblical_text") ? (
            <span className="mt-1 block text-sm text-clay">
              {fieldError("biblical_text")}
            </span>
          ) : null}
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-ink">Tema da série</span>
          <input
            className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
            {...register("series_theme")}
            name="series_theme"
            required
          />
          {fieldError("series_theme") ? (
            <span className="mt-1 block text-sm text-clay">
              {fieldError("series_theme")}
            </span>
          ) : null}
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-ink">Notas</span>
          <textarea
            className="mt-2 min-h-44 w-full rounded-md border border-ink/15 bg-white px-3 py-2 leading-7 outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
            {...register("notes")}
            name="notes"
            required
          />
          {fieldError("notes") ? (
            <span className="mt-1 block text-sm text-clay">{fieldError("notes")}</span>
          ) : null}
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-ink">Ficheiro PDF</span>
          <span className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink/20 bg-mist/40 px-4 py-6 text-center text-sm text-ink/65 transition hover:border-olive/50 hover:bg-olive/5">
            <Upload className="mb-2 text-olive" size={24} />
            Selecciona um PDF até 15 MB
            {initialValues?.pdf_path ? (
              <span className="mt-1 text-xs text-olive">Já existe um PDF anexado.</span>
            ) : null}
          </span>
          <input className="sr-only" name="pdf" type="file" accept="application/pdf" />
          {fieldError("pdf") ? (
            <span className="mt-1 block text-sm text-clay">{fieldError("pdf")}</span>
          ) : null}
        </label>
      </div>

      {state.message ? (
        <p className="mt-5 rounded-md bg-olive/10 px-3 py-2 text-sm text-olive">
          {state.message}
        </p>
      ) : null}

      <button
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive/90 disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        <Save size={18} />
        {isPending ? "A guardar..." : submitLabel}
      </button>
    </form>
  );
}
