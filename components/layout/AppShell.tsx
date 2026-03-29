"use client";

import { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <Sidebar activePath={pathname} />
      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activePath={pathname}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar title={getTitle(pathname)} onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
