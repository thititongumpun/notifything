// Pure Thai describer for 5-field cron strings. Contract: a wrong description is worse than none,
// so anything not understood exactly returns CRON_FALLBACK.
// ponytail: covers the common shapes only (no minute ranges, no steps on dom/month/dow, no
// day-of-month + day-of-week OR semantics); extend by adding a case, never by guessing.
export const CRON_FALLBACK = "รูปแบบ cron กำหนดเอง";

const DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
const DOW_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MON_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MACROS: Record<string, string> = {
  "@hourly": "0 * * * *",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@weekly": "0 0 * * 0",
  "@monthly": "0 0 1 * *",
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
};

type F =
  | { k: "any" }
  | { k: "step"; n: number }
  | { k: "list"; v: number[] }
  | { k: "range"; a: number; b: number };

type Opts = { cycle?: number; range?: boolean; names?: string[]; base?: number };

function field(s: string, min: number, max: number, o: Opts = {}): F | null {
  if (s === "*") return { k: "any" };
  const step = /^\*\/(\d+)$/.exec(s);
  if (step) {
    const n = Number(step[1]);
    // Only steps that divide the cycle evenly: */7 on minutes would misfire at the hour boundary.
    if (!o.cycle || n < 1 || n >= o.cycle || o.cycle % n !== 0) return null;
    return n === 1 ? { k: "any" } : { k: "step", n };
  }
  const val = (t: string): number => {
    const v = /^\d+$/.test(t) ? Number(t) : (o.names?.indexOf(t.toUpperCase()) ?? -1) + (o.base ?? 0);
    return Number.isInteger(v) && v >= min && v <= max ? v : NaN;
  };
  const items = s.split(",");
  if (items.length > 6) return null;
  if (items.length === 1 && s.includes("-")) {
    if (!o.range) return null;
    const [x, y, ...rest] = s.split("-");
    const a = val(x);
    const b = val(y ?? "");
    if (rest.length || !(a <= b)) return null; // also rejects NaN
    return a === b ? { k: "list", v: [a] } : { k: "range", a, b };
  }
  const v = items.map(val);
  if (v.some(Number.isNaN)) return null;
  return { k: "list", v: [...new Set(v)].sort((p, q) => p - q) };
}

// "A, B และ C"; sp = " " for numbers/times, "" for Thai words that already start with วัน/เดือน.
function join(items: string[], sp = ""): string {
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} และ${sp}${items[items.length - 1]}`;
}

const pad = (n: number) => String(n).padStart(2, "0");
const hm = (h: number, m: number) => `${pad(h)}:${pad(m)}`;

function time(m: F, h: F): string | null {
  if (m.k === "any" || m.k === "step") {
    const every = `ทุกๆ ${m.k === "step" ? m.n : 1} นาที`;
    if (h.k === "any") return every;
    const [a, b] =
      h.k === "range" ? [h.a, h.b] : h.k === "list" && h.v.length === 1 ? [h.v[0], h.v[0]] : [-1, -1];
    return a < 0 ? null : `${every} ในช่วง ${hm(a, 0)}–${hm(b, 59)}`;
  }
  if (m.k !== "list") return null; // minute ranges are not supported
  const mins = join(m.v.map(String), " ");
  if (h.k === "any") return `ทุกชั่วโมง ตรงนาทีที่ ${mins}`;
  if (h.k === "step") return `ทุกๆ ${h.n} ชั่วโมง ตรงนาทีที่ ${mins}`;
  if (h.k === "range") {
    if (m.v.length !== 1) return null;
    return `ทุกชั่วโมง ตั้งแต่ ${hm(h.a, m.v[0])} ถึง ${hm(h.b, m.v[0])}`;
  }
  const times = h.v.flatMap((hh) => m.v.map((mm) => hm(hh, mm)));
  return times.length > 6 ? null : `เวลา ${join(times, " ")}`;
}

// "" = no day phrase, null = unsupported.
function day(d: F, w: F, clock: boolean): string | null {
  const dAny = d.k === "any";
  if (!dAny && w.k !== "any") return null; // dom OR dow semantics: not described
  if (dAny && w.k === "any") return clock ? "ทุกวัน" : "";
  if (!dAny) {
    if (d.k === "list") return `ทุกวันที่ ${join(d.v.map(String), " ")} ของเดือน`;
    if (d.k === "range") return `ทุกวันที่ ${d.a}–${d.b} ของเดือน`;
    return null;
  }
  if (w.k === "list") {
    const v = [...new Set(w.v.map((x) => x % 7))].sort((p, q) => (p || 7) - (q || 7));
    return `ทุก${join(v.map((x) => `วัน${DAYS[x]}`))}`;
  }
  if (w.k === "range" && !(w.a === 0 && w.b === 7)) return `วัน${DAYS[w.a % 7]}–${DAYS[w.b % 7]}`;
  return null;
}

function month(mo: F): string | null {
  if (mo.k === "any") return "";
  if (mo.k === "list") return ` เฉพาะ${join(mo.v.map((x) => `เดือน${MONTHS[x - 1]}`))}`;
  if (mo.k === "range") return ` เฉพาะเดือน${MONTHS[mo.a - 1]}–${MONTHS[mo.b - 1]}`;
  return null;
}

export function describeCron(expr: string): string {
  let s = expr.trim();
  if (s.startsWith("@")) s = MACROS[s.toLowerCase()] ?? "";
  const p = s.split(/\s+/);
  if (p.length !== 5) return CRON_FALLBACK;
  const m = field(p[0], 0, 59, { cycle: 60 });
  const h = field(p[1], 0, 23, { cycle: 24, range: true });
  const d = field(p[2], 1, 31, { range: true });
  const mo = field(p[3], 1, 12, { range: true, names: MON_NAMES, base: 1 });
  const w = field(p[4], 0, 7, { range: true, names: DOW_NAMES, base: 0 });
  if (!m || !h || !d || !mo || !w) return CRON_FALLBACK;
  const t = time(m, h);
  const dp = t === null ? null : day(d, w, t.startsWith("เวลา"));
  const mp = month(mo);
  if (t === null || dp === null || mp === null) return CRON_FALLBACK;
  return `ทำงาน${dp ? `${dp} ` : ""}${t}${mp}`;
}

// ---- next run / run days (crons fire in Asia/Bangkok, UTC+7, no DST) ----
const BKK_MS = 7 * 3600_000;

function toSet(f: F, min: number, max: number, mod = 0): Set<number> {
  const out = new Set<number>();
  for (let i = min; i <= max; i++) {
    const ok =
      f.k === "any" ||
      (f.k === "step" && i % f.n === 0) ||
      (f.k === "list" && f.v.some((x) => (mod ? x % mod : x) === i)) ||
      (f.k === "range" && i >= f.a && i <= f.b);
    if (ok) out.add(i);
  }
  return out;
}

// null exactly when describeCron falls back, so the two can never disagree about what is understood.
function parseSets(expr: string) {
  if (describeCron(expr) === CRON_FALLBACK) return null;
  let s = expr.trim();
  if (s.startsWith("@")) s = MACROS[s.toLowerCase()];
  const p = s.split(/\s+/);
  const f = [
    field(p[0], 0, 59, { cycle: 60 }),
    field(p[1], 0, 23, { cycle: 24, range: true }),
    field(p[2], 1, 31, { range: true }),
    field(p[3], 1, 12, { range: true, names: MON_NAMES, base: 1 }),
    field(p[4], 0, 7, { range: true, names: DOW_NAMES, base: 0 }),
  ] as F[];
  return {
    min: [...toSet(f[0], 0, 59)],
    hour: [...toSet(f[1], 0, 23)],
    dom: toSet(f[2], 1, 31),
    mon: toSet(f[3], 1, 12),
    dow: toSet(f[4], 0, 6, 7),
  };
}

type Sets = NonNullable<ReturnType<typeof parseSets>>;
// u = a Date whose UTC fields hold Bangkok wall time.
const dayMatches = (c: Sets, u: Date) =>
  c.mon.has(u.getUTCMonth() + 1) && c.dom.has(u.getUTCDate()) && c.dow.has(u.getUTCDay());

export function nextRun(expr: string, from: Date): Date | null {
  const c = parseSets(expr);
  if (!c) return null;
  const startMs = Math.floor((from.getTime() + BKK_MS) / 60_000) * 60_000 + 60_000;
  const day0 = Math.floor(startMs / 86_400_000) * 86_400_000;
  for (let i = 0; i < 366 * 5; i++) {
    const dayMs = day0 + i * 86_400_000;
    if (!dayMatches(c, new Date(dayMs))) continue;
    for (const h of c.hour)
      for (const m of c.min) {
        const t = dayMs + (h * 60 + m) * 60_000;
        if (t >= startMs) return new Date(t - BKK_MS);
      }
  }
  return null; // e.g. Feb 31: never fires
}

export function runDaysInMonth(expr: string, year: number, month: number): number[] | null {
  const c = parseSets(expr);
  if (!c) return null;
  const n = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: n }, (_, i) => i + 1).filter((d) => dayMatches(c, new Date(Date.UTC(year, month - 1, d))));
}
