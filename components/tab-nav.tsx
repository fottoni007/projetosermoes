"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  exact?: boolean;
};

export default function TabNav({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();

  return (
    <nav className="-mb-px flex gap-1 overflow-x-auto text-sm font-medium">
      {tabs.map((tab) => {
        const isActive = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || (tab.href !== "/sermoes" && pathname.startsWith(tab.href));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 pb-3 px-2 transition ${
              isActive
                ? "border-olive text-olive"
                : "border-transparent text-ink/70 hover:text-ink"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge && tab.badge > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-xs font-bold text-white">
                {tab.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
