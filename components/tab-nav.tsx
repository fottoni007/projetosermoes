"use client";

import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Tab = {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  exact?: boolean;
};

// Determina qual aba está ativa. As abas de secção (tudo menos a raiz /sermoes)
// ganham por correspondência de prefixo; a Biblioteca fica ativa para /sermoes
// e para qualquer rota de sermão (detalhe, novo, editar) que não pertença a
// outra secção — assim a aba nunca "desaparece" ao abrir um sermão.
function computeActiveHref(pathname: string, tabs: Tab[]): string | null {
  const section = tabs.find(
    (t) => t.href !== "/sermoes" && (pathname === t.href || pathname.startsWith(`${t.href}/`))
  );
  if (section) return section.href;
  if (pathname === "/sermoes" || pathname.startsWith("/sermoes/")) return "/sermoes";
  return null;
}

function Badge({ value }: { value: number }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-xs font-bold tabular-nums text-white">
      {value > 9 ? "9+" : value}
    </span>
  );
}

export default function TabNav({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const activeHref = computeActiveHref(pathname, tabs);
  const current = tabs.find((t) => t.href === activeHref);
  const totalBadge = tabs.reduce((s, t) => s + (t.badge ?? 0), 0);

  return (
    <>
      {/* Desktop: abas horizontais com fade que sugere mais conteúdo ao rolar */}
      <div className="relative hidden sm:block">
        <nav className="-mb-px flex gap-1 overflow-x-auto pr-8 text-sm font-medium">
          {tabs.map((tab) => {
            const active = tab.href === activeHref;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-2 pb-3 transition ${
                  active ? "border-olive text-olive" : "border-transparent text-ink/70 hover:text-ink"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge && tab.badge > 0 ? <Badge value={tab.badge} /> : null}
              </Link>
            );
          })}
        </nav>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent"
        />
      </div>

      {/* Telemóvel: menu expansível */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Abrir menu de navegação"
          className="-mb-px flex w-full items-center justify-between border-b-2 border-olive py-3 text-sm font-semibold text-olive"
        >
          <span className="inline-flex items-center gap-2">
            {current?.icon ?? <Menu size={16} />}
            {current?.label ?? "Menu"}
          </span>
          <span className="inline-flex items-center gap-2">
            {!open && totalBadge > 0 ? <Badge value={totalBadge} /> : null}
            <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </span>
        </button>
        {open && (
          <div className="border-t border-ink/10 py-2">
            {tabs.map((tab) => {
              const active = tab.href === activeHref;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-3 text-sm transition ${
                    active ? "bg-olive/10 font-semibold text-olive" : "text-ink/80 hover:bg-mist"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.badge && tab.badge > 0 ? (
                    <span className="ml-auto">
                      <Badge value={tab.badge} />
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
