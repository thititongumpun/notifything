"use client";
/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
import Link from "next/link";
import { CreditCard, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/payments", label: "Payments", icon: CreditCard },
];

export function MobileNav({ activePath }: { activePath: string }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--color-paper-2)] border-t border-[var(--color-rule)] grid grid-cols-2"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = activePath === href || activePath.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center justify-center gap-0.5 min-h-[3rem] px-[var(--space-2xs)] py-[var(--space-3xs)] text-[length:var(--text-xs)] font-medium whitespace-nowrap active:translate-y-px ${
              active
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-ink-2)]"
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
