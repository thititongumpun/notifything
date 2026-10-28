"use client";
import Link from "next/link";
import { isActive, navItems } from "./nav";

export function MobileNav({ activePath }: { activePath: string }) {
  return (
    <nav
      aria-label="เมนูหลัก"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--color-paper-2)] border-t border-[var(--color-rule)] grid grid-cols-3"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = isActive(activePath, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center justify-center gap-0.5 min-h-[3.25rem] px-[var(--space-2xs)] py-[var(--space-3xs)] text-[length:var(--text-xs)] whitespace-nowrap active:translate-y-px ${
              active ? "font-bold text-[var(--color-ink)]" : "font-medium text-[var(--color-ink-2)]"
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" strokeWidth={active ? 2.75 : 1.75} />
            <span className={`border-b-2 ${active ? "border-[var(--color-ink)]" : "border-transparent"}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
