"use client";

import { SignIn } from "@clerk/nextjs";
import { useSyncExternalStore } from "react";
import { DateLeaf } from "@/components/calendar/DateLeaf";

const noop = () => () => {};

export default function SignInPage() {
  // Client-only "today" so the leaf is never a stale prerendered day.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)] px-[var(--space-sm)] py-[var(--space-md)]">
      <div className="flex w-full min-w-0 max-w-[25rem] flex-col items-center gap-[var(--space-sm)]">
        <span className="font-display text-[length:var(--text-lg)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
          Notifything
        </span>
        <div className="min-h-[150px]">{mounted && <DateLeaf date={new Date()} size="lg" />}</div>
        <SignIn />
      </div>
    </div>
  );
}
