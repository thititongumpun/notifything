import Link from "next/link";
import { isActive, navItems } from "./nav";

export function Sidebar({ activePath }: { activePath: string }) {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 bg-[var(--color-paper-2)] border-r border-[var(--color-rule)]">
      <div className="px-5 py-5">
        <span className="font-display text-[length:var(--text-md)] tracking-[-0.02em] font-semibold text-[var(--color-ink)]">
          Notifything
        </span>
      </div>
      <nav
        className="flex flex-col gap-[var(--space-3xs)] p-[var(--space-xs)] flex-1 border-t border-[var(--color-rule)]"
        aria-label="เมนูหลัก"
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(activePath, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-[var(--space-xs)] px-[var(--space-xs)] min-h-[2.75rem] rounded-[var(--radius-input)] text-[length:var(--text-sm)] whitespace-nowrap transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] ${
                active
                  ? "font-bold text-[var(--color-ink)] bg-[var(--color-paper-3)]"
                  : "font-medium text-[var(--color-ink-2)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={active ? 2.75 : 1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
