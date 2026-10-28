/** Format a THB amount (the "฿" symbol is rendered at call sites). */
export function fmt(amount: string | number) {
  return Number(amount).toLocaleString("th-TH");
}

// ---- Bangkok / Buddhist-era helpers ----
const TZ = "Asia/Bangkok";
const th = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("th-TH", { timeZone: TZ, ...o });
const D = (v: string | Date) => (v instanceof Date ? v : new Date(v));

export const THAI_WEEKDAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"] as const;
export const THAI_WEEKDAY_INITIALS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"] as const;

const bkkFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ, calendar: "gregory", hourCycle: "h23",
  year: "numeric", month: "numeric", day: "numeric", weekday: "short", hour: "numeric", minute: "numeric",
});

/** Gregorian calendar fields of an instant in Asia/Bangkok (weekday 0 = Sunday). */
export function bkkParts(d: Date) {
  const p = Object.fromEntries(bkkFmt.formatToParts(d).map((x) => [x.type, x.value]));
  return {
    year: +p.year, month: +p.month, day: +p.day,
    weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday),
    hour: +p.hour, minute: +p.minute,
  };
}

/** "5 พ.ย. 2569" */
export function fmtThaiDate(v: string | Date | null) {
  return v ? th({ day: "numeric", month: "short", year: "numeric" }).format(D(v)) : "—";
}

/** "5 พ.ย. 2569 12:00" */
export function fmtThaiDateTime(v: string | Date | null) {
  if (!v) return "—";
  return `${fmtThaiDate(v)} ${th({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(D(v))}`;
}

/** "พฤศจิกายน 2569" */
export function fmtThaiMonthYear(v: string | Date) {
  return th({ month: "long", year: "numeric" }).format(D(v));
}

/** "05/11/69" (dd/mm/BE-yy) */
export function fmtPassbookDate(v: string | Date) {
  const p = bkkParts(D(v));
  const z = (n: number) => String(n).padStart(2, "0");
  return `${z(p.day)}/${z(p.month)}/${z((p.year + 543) % 100)}`;
}

/** Bangkok calendar days from `now` to `target` (negative when past). */
export function daysUntil(target: Date, now: Date) {
  const u = (d: Date) => { const p = bkkParts(d); return Date.UTC(p.year, p.month - 1, p.day); };
  return Math.round((u(target) - u(now)) / 86_400_000);
}

export function relativeDayLabel(n: number) {
  if (n === 0) return "วันนี้";
  if (n === 1) return "พรุ่งนี้";
  return n > 1 ? `อีก ${n} วัน` : `เลยกำหนด ${-n} วัน`;
}
