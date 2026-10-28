import { card } from "@/components/ui/styles";
import { THAI_WEEKDAY_INITIALS, THAI_WEEKDAYS, fmtThaiMonthYear } from "@/lib/format";

export type MonthDays = Record<number, string[]>; // day -> job names

export function MonthCalendar({
  year, month, days, jobCount, skipped, todayDay, dueDay,
}: {
  year: number; month: number; days: MonthDays; jobCount: number; skipped: number;
  todayDay: number | null; dueDay: number | null;
}) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const lead = first.getUTCDay();
  const n = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const heading = fmtThaiMonthYear(new Date(Date.UTC(year, month - 1, 15)));

  return (
    <section aria-label={`ปฏิทิน ${heading}`} className={`${card} min-w-0 p-[var(--space-sm)]`}>
      <div className="flex items-baseline justify-between gap-[var(--space-2xs)]">
        <h2 className="font-display text-[length:var(--text-md)] font-semibold text-[var(--color-ink)]">{heading}</h2>
        <span className="text-[length:var(--text-sm)] text-[var(--color-ink-2)]">{jobCount} งาน</span>
      </div>
      <div className="mt-[var(--space-xs)] grid grid-cols-7 gap-1 text-center">
        {THAI_WEEKDAY_INITIALS.map((w, i) => (
          <div key={i} className="text-[length:var(--text-xs)] font-medium" style={{ color: i === 0 ? "var(--color-sunday)" : "var(--color-ink-2)" }}>
            {w}
          </div>
        ))}
        {Array.from({ length: lead }).map((_, i) => <div key={`l${i}`} />)}
        {Array.from({ length: n }, (_, i) => i + 1).map((d) => {
          const wd = (lead + d - 1) % 7;
          const names = days[d] ?? [];
          const label = `${THAI_WEEKDAYS[wd]}ที่ ${d}${names.length ? `: ${names.join(", ")}` : ""}${d === todayDay ? " (วันนี้)" : ""}`;
          return (
            <div
              key={d}
              role="img"
              aria-label={label}
              className={`flex min-h-[44px] min-w-0 flex-col items-center justify-center rounded-[var(--radius-leaf)] ${d === dueDay ? "outline outline-2 -outline-offset-2 outline-[var(--color-ink)]" : ""}`}
            >
              <span
                aria-hidden
                className={`font-mono text-[length:var(--text-xs)] leading-5 tabular-nums ${d === todayDay ? "border-b-2 border-[var(--color-ink)] font-bold" : ""}`}
                style={{ color: wd === 0 ? "var(--color-sunday)" : "var(--color-ink)" }}
              >
                {d}
              </span>
              <span aria-hidden className="flex h-[7px] items-center gap-px">
                {names.slice(0, 3).map((_, i) => (
                  <i key={i} className="size-[5px] rounded-full" style={{ background: `var(--day-${wd})` }} />
                ))}
                {names.length > 3 ? <b className="text-[10px] leading-none text-[var(--color-ink-2)]">+</b> : null}
              </span>
            </div>
          );
        })}
      </div>
      {skipped > 0 ? (
        <p className="mt-[var(--space-xs)] text-[length:var(--text-sm)] text-[var(--color-ink-2)]">ไม่แสดง {skipped} งาน (รูปแบบกำหนดเอง)</p>
      ) : null}
    </section>
  );
}
