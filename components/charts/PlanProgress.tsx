/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
import type { PaymentPlan } from "@/lib/types";
import { fmt, fmtPassbookDate, fmtThaiMonthYear } from "@/lib/format";
import { planTotals } from "@/lib/plan";

function fmtMonthYear(date: string | null): string | null {
  if (!date || Number.isNaN(new Date(date).getTime())) return null;
  return fmtThaiMonthYear(date);
}

/** Per-plan progress toward 100% — continuous bar with a clearly visible
 *  unpaid track (accent = paid, --color-track = remaining), plus the numbers
 *  that answer "how long to 100%": months, money left, projected finish.
 *  Screen readers get the sr-only table. */
export function PlanProgress({ plan, showTitle = true }: { plan: PaymentPlan; showTitle?: boolean }) {
  const months = [...plan.payments].sort(
    (a, b) => a.paymentMonth - b.paymentMonth,
  );
  const total = plan.totalMonths || months.length;
  if (total === 0) return null;

  const { paidCount, totalSum, remainingSum, monthsLeft, pct } = planTotals(plan);
  // The plan's end date is the finish line; record-based lookups can't see
  // beyond the months billed so far.
  const finish = fmtMonthYear(plan.endDate);
  const complete = paidCount >= total;

  return (
    <figure className="min-w-0">
      <figcaption className="flex items-baseline justify-between gap-[var(--space-2xs)] min-w-0">
        <span className="min-w-0 font-display text-[length:var(--text-sm)] font-medium leading-[var(--leading-table)] text-[var(--color-ink)] [overflow-wrap:anywhere]">
          {showTitle ? plan.description : `ชำระแล้ว ${paidCount}/${total} งวด`}
        </span>
        <span
          className={`shrink-0 font-mono tabular-nums text-[length:var(--text-md)] leading-none ${
            "text-[var(--color-ink)]"
          }`}
        >
          {pct}%
        </span>
      </figcaption>

      {/* Track = remaining (visible), fill = paid (accent) */}
      <div
        className="mt-[var(--space-2xs)] h-[10px] overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-track)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`${plan.description}: ชำระแล้ว ${paidCount} จาก ${total} งวด (${pct}%) คงเหลือ ฿${fmt(remainingSum)}${finish ? ` จบ ${finish}` : ""}`}
      >
        <div
          className="h-full rounded-[var(--radius-pill)] bg-[var(--color-accent)] transition-[width] duration-[var(--dur-short)] ease-[var(--ease-out)]"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* The "how long to 100%" numbers */}
      <div className="mt-[var(--space-2xs)] flex flex-wrap items-baseline gap-x-[var(--space-xs)] gap-y-[var(--space-3xs)] tabular-nums text-[length:var(--text-xs)] leading-[var(--leading-table)] text-[var(--color-ink-2)]">
        {complete ? (
          <span className="text-[var(--color-ink)]">ชำระครบ {total} งวดแล้ว</span>
        ) : (
          <>
            {showTitle ? (
              <span>
                ชำระแล้ว <span className="text-[var(--color-ink)]">{paidCount}/{total}</span> งวด
              </span>
            ) : null}
            <span>
              คงเหลือ ฿{fmt(remainingSum)} จาก ฿{fmt(totalSum)}
            </span>
            <span>
              อีก {monthsLeft} งวด{finish ? ` · จบ ${finish}` : ""}
            </span>
          </>
        )}
      </div>

      {/* ponytail: sr-only goes on this div, not the table — a <table>'s used
          width is max(specified, min-content) per CSS table sizing, so
          width:1px never shrinks it (measures ~770px, blowing out scrollWidth
          at narrow viewports). A block-level div collapses to 1px fine. */}
      <div className="sr-only">
        <table>
          <caption>ความคืบหน้าการชำระ {plan.description}</caption>
          <thead>
            <tr>
              <th scope="col">งวด</th>
              <th scope="col">วันครบกำหนด</th>
              <th scope="col">จำนวนเงิน (บาท)</th>
              <th scope="col">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {months.map((p) => (
              <tr key={p.id}>
                <th scope="row">{p.paymentMonth}</th>
                <td>{fmtPassbookDate(p.dueDate)}</td>
                <td>{fmt(p.amount)}</td>
                <td>{p.isPaid ? "ชำระแล้ว" : "ยังไม่ชำระ"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
