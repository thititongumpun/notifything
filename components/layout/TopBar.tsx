"use client";

import { Avatar, Dropdown, Label } from "@heroui/react";
import { Menu } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useClerkAuth } from "@/hooks/useClerkAuth";

interface TopBarProps {
  title: string;
  onMenuOpen: () => void;
}

export function TopBar({ title, onMenuOpen }: TopBarProps) {
  const { user } = useClerkAuth();
  const { signOut } = useClerk();

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user.fullName?.[0] ?? "U";

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-16 border-b border-neutral-800 bg-neutral-950 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          onClick={onMenuOpen}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
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
                <p className="text-xs text-neutral-400">{user.emailAddress}</p>
              </div>
            </Dropdown.Item>
            <Dropdown.Item id="settings" textValue="Settings">
              <Label>Settings</Label>
            </Dropdown.Item>
            <Dropdown.Item id="logout" textValue="Log out">
              <Label className="text-red-400">Log out</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </header>
  );
}
