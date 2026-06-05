"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type SearchBoxProps = {
  defaultValue: string;
};

export default function SearchBox({ defaultValue }: SearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(formData: FormData) {
    const query = String(formData.get("q") ?? "").trim();
    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`/sermoes${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  return (
    <form action={handleSearch} className="flex w-full max-w-md items-center gap-2">
      <label className="relative flex-1">
        <span className="sr-only">Pesquisar sermões</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/70"
          size={18}
        />
        <input
          className="h-11 w-full rounded-md border border-ink/10 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-olive focus:ring-4 focus:ring-olive/10"
          defaultValue={defaultValue}
          name="q"
          placeholder="Pesquisar..."
          type="search"
        />
      </label>
      <button
        className="inline-flex h-11 items-center justify-center rounded-md bg-olive px-4 text-sm font-semibold text-white transition hover:bg-olive/90 disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        Pesquisar
      </button>
      {defaultValue ? (
        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-ink/10 bg-white text-ink/70 transition hover:border-clay/40 hover:text-clay"
          type="button"
          onClick={() => router.push("/sermoes")}
          aria-label="Limpar pesquisa"
        >
          <X size={18} />
        </button>
      ) : null}
    </form>
  );
}
