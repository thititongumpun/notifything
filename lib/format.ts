/** Format a THB amount (the "฿" symbol is rendered at call sites). */
export function fmt(amount: string | number) {
  return Number(amount).toLocaleString("th-TH");
}

/** Date only, e.g. "Sep 2, 2026". */
export function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Date + time, e.g. "Sep 2, 2026, 09:41 AM". */
export function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
