/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
import Link from "next/link";
import { Bell, CreditCard, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/payments", label: "Payments", icon: CreditCard },
];

export function Sidebar({ activePath }: { activePath: string }) {
  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-[var(--color-paper-2)] border-r border-[var(--color-rule)]"
    >
      <div className="flex items-center gap-2 px-5 py-5 min-w-0">
        <Bell className="w-5 h-5 shrink-0 text-[var(--color-accent)]" />
        <span className="text-[var(--text-md)] font-semibold text-[var(--color-ink)] whitespace-nowrap">
          Notifything
        </span>
      </div>
      <nav
        className="flex flex-col gap-1 p-3 flex-1 border-t border-[var(--color-rule)]"
        aria-label="Primary"
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = activePath === href || activePath.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex items-center gap-3 px-3 min-h-[2.75rem] my-0.5 rounded-[var(--radius-input)] text-sm font-medium whitespace-nowrap transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] ${
                active
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-ink-2)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)]"
              }`}
              style={
                active
                  ? {
                      background:
                        "color-mix(in oklab, var(--color-accent) 15%, transparent)",
                    }
                  : undefined
              }
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-[var(--color-accent)]"
                />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
