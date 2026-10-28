import { bkkParts, THAI_WEEKDAYS, fmtThaiMonthYear } from "@/lib/format";

const LEAF =
  "flex-none overflow-hidden border border-[var(--color-leaf-edge)] bg-[var(--color-paper-2)] text-center text-[var(--color-ink)]";

export function DateLeaf({ date, size }: { date: Date | null; size: "lg" | "sm" }) {
  const p = date ? bkkParts(date) : null;
  const band = p ? `var(--day-${p.weekday})` : "var(--color-track)";
  const bandInk = p ? `var(--day-ink-${p.weekday})` : "var(--color-ink-2)";
  const label = date && p ? `วัน${THAI_WEEKDAYS[p.weekday]}ที่ ${p.day} ${fmtThaiMonthYear(date)}` : "ไม่ทราบวันที่";

  if (size === "sm") {
    return (
      <span role="img" aria-label={label} className={`${LEAF} inline-block w-[34px] rounded-[4px]`}>
        <span aria-hidden className="block">
          <b className="block h-[5px]" style={{ background: band }} />
          <span className="block font-display text-[15px] font-bold leading-[22px]">{p ? p.day : "—"}</span>
        </span>
      </span>
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={`${LEAF} w-[118px] rounded-[var(--radius-leaf)] shadow-[0_1px_0_var(--color-leaf-edge),0_3px_0_-1px_#fff,0_4px_0_-1px_var(--color-leaf-edge)]`}
    >
      <div aria-hidden>
        <div className="flex justify-center gap-7 pt-1" style={{ background: band }}>
          <i className="size-1.5 rounded-full bg-[var(--color-paper)]" />
          <i className="size-1.5 rounded-full bg-[var(--color-paper)]" />
        </div>
        <div
          className="py-1 font-display text-[13px] font-semibold"
          style={{ background: band, color: bandInk }}
        >
          {p ? THAI_WEEKDAYS[p.weekday] : "—"}
        </div>
        <div className="pt-1.5 font-display text-[76px] font-bold leading-none">{p ? p.day : "—"}</div>
        <div className="px-1 pb-2 pt-0.5 text-[length:var(--text-xs)] text-[var(--color-ink-2)]">
          {date ? fmtThaiMonthYear(date) : " "}
        </div>
      </div>
    </div>
  );
}
