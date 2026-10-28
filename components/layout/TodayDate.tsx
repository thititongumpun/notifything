"use client";

import { useSyncExternalStore } from "react";
import { bkkParts, fmtThaiDate, THAI_WEEKDAY_INITIALS } from "@/lib/format";

const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};
const snapshot = () => {
  const now = new Date();
  return `${THAI_WEEKDAY_INITIALS[bkkParts(now).weekday]}. ${fmtThaiDate(now)}`;
};

// Client-only so a cached page never shows a stale day; fixed min-width avoids layout shift.
export function TodayDate() {
  const text = useSyncExternalStore(subscribe, snapshot, () => "");
  return (
    <span className="inline-block min-w-[9.5rem] text-[length:var(--text-xs)] text-[var(--color-ink-2)] whitespace-nowrap">
      {text}
    </span>
  );
}
