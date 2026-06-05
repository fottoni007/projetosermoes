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

function isActive(pathname: string, tab: Tab) {
  return tab.exact
    ? pathname === tab.href
    : pathname === tab.href || (tab.href !== "/sermoes" && pathname.startsWith(tab.href));
}

function Badge({ value }: { value: number }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-xs font-bold text-white">
      {value > 9 ? "9+" : value}
    </span>
  );
}

export default function TabNav({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = tabs.find((t) => isActive(pathname, t));
  const totalBadge = tabs.reduce((s, t) => s + (t.badge ?? 0), 0);

  return (
    <>
      {/* Desktop: abas horizontais */}
      <nav className="-mb-px hidden gap-1 overflow-x-auto text-sm font-medium sm:flex">
        {tabs.map((tab) => {
          const active = isActive(pathname, tab);
          return (
            <Link
              key={tab.href}
              href={tab.href}
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
              const active = isActive(pathname, tab);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
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
