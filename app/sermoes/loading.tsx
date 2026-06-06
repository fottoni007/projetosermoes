// Estado de carregamento mostrado durante transições (pesquisa, paginação,
// navegação entre secções). O cabeçalho e as abas permanecem visíveis; só a
// área de conteúdo é substituída por este esqueleto.
export default function Loading() {
  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="h-8 w-56 max-w-full animate-pulse rounded-md bg-ink/10" />
      <div className="mt-6 grid gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-ink/10 bg-white p-4 shadow-soft sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="h-5 w-2/3 animate-pulse rounded bg-ink/10" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-ink/5" />
                <div className="mt-2 h-4 w-32 animate-pulse rounded bg-ink/5" />
              </div>
              <div className="h-7 w-24 shrink-0 animate-pulse rounded-md bg-ink/5" />
            </div>
            <div className="mt-3 h-4 w-40 animate-pulse rounded bg-ink/5" />
          </div>
        ))}
      </div>
    </section>
  );
}
