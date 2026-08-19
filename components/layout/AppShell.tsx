"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/notifications": "Notifications",
  "/notifications/new": "New Notification",
  "/payments": "Payments",
  "/payments/new": "Add Payment",
};

function getTitle(path: string): string {
  if (pageTitles[path]) return pageTitles[path];
  if (path.startsWith("/notifications/")) return "Edit Notification";
  return "Notifything";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)]">
      <Sidebar activePath={pathname} />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar title={getTitle(pathname)} />
        <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
        <MobileNav activePath={pathname} />
      </div>
    </div>
  );
}
