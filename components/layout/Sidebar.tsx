import Link from "next/link";
import { Bell, CreditCard, LayoutDashboard } from "lucide-react";
import { Separator } from "@heroui/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/payments", label: "Payments", icon: CreditCard },
];

export function Sidebar({ activePath }: { activePath: string }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-neutral-950 border-r border-neutral-800">
      <div className="flex items-center gap-2 px-6 py-5">
        <Bell className="w-6 h-6 text-indigo-400" />
        <span className="text-lg font-bold text-white">Notifything</span>
      </div>
      <Separator />
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = activePath === href || activePath.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
