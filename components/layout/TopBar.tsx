"use client";

import { Avatar, Dropdown, Label } from "@heroui/react";
import { Bell } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useClerkAuth } from "@/hooks/useClerkAuth";

export function TopBar({ title }: { title: string }) {
  const { user } = useClerkAuth();
  const { signOut } = useClerk();

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user.fullName?.[0] ?? "U";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-2 h-14 px-4 md:px-6 border-b border-[var(--color-rule)] bg-[color-mix(in_oklab,var(--color-paper)_85%,transparent)] backdrop-blur-md">
      {/* Mobile: wordmark (sidebar hidden below md); Desktop: page title */}
      <div className="flex items-center gap-2 min-w-0 md:min-w-0">
        <span className="flex md:hidden items-center gap-2 shrink-0">
          <Bell className="w-5 h-5 text-[var(--color-accent)]" />
          <span className="text-[var(--text-md)] font-semibold text-[var(--color-ink)] whitespace-nowrap">
            Notifything
          </span>
        </span>
        <h1
          className="hidden md:block text-sm font-semibold text-[var(--color-ink)] min-w-0"
          style={{ fontSize: "1rem", overflowWrap: "anywhere" }}
        >
          {title}
        </h1>
      </div>
      <Dropdown>
        <Dropdown.Trigger>
          <Avatar size="sm" color="accent" className="cursor-pointer">
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Menu onAction={(key) => { if (key === "logout") signOut({ redirectUrl: "/sign-in" }); }}>
            <Dropdown.Item id="profile" textValue={user.fullName}>
              <div>
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-[var(--color-ink-2)]">{user.emailAddress}</p>
              </div>
            </Dropdown.Item>
            <Dropdown.Item id="settings" textValue="Settings">
              <Label>Settings</Label>
            </Dropdown.Item>
            <Dropdown.Item id="logout" textValue="Log out">
              <Label className="text-[var(--color-danger)]">Log out</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </header>
  );
}
