/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
import type { PaymentPlan } from "@/lib/types";
import { fmt } from "@/lib/format";

function fmtMonthYear(date: string | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Per-plan progress toward 100% — continuous bar with a clearly visible
 *  unpaid track (accent = paid, --color-track = remaining), plus the numbers
 *  that answer "how long to 100%": months, money left, projected finish.
 *  Screen readers get the sr-only table. */
export function PlanProgress({ plan }: { plan: PaymentPlan }) {
  const months = [...plan.payments].sort(
    (a, b) => a.paymentMonth - b.paymentMonth,
  );
  const total = plan.totalMonths || months.length;
  if (total === 0) return null;

  const paidCount = months.filter((p) => p.isPaid).length;
  const pct = Math.min(100, Math.round((paidCount / total) * 100));
  const paidSum = months
    .filter((p) => p.isPaid)
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const totalSum = months.reduce((sum, p) => sum + Number(p.amount), 0);
  const remainingSum = Math.max(0, totalSum - paidSum);
  const monthsLeft = Math.max(0, total - paidCount);
  const lastUnpaid = months
    .filter((p) => !p.isPaid)
    .reduce<string | null>(
      (latest, p) => (!latest || p.dueDate > latest ? p.dueDate : latest),
      null,
    );
  const finish = fmtMonthYear(lastUnpaid);
  const complete = paidCount >= total;

  return (
    <figure className="min-w-0">
      <figcaption className="flex items-baseline justify-between gap-[var(--space-2xs)] min-w-0">
        <span className="text-[length:var(--text-sm)] font-medium leading-[var(--leading-table)] text-[var(--color-ink)] min-w-0 truncate">
          {plan.description}
        </span>
        <span
          className={`shrink-0 font-mono tabular-nums text-[length:var(--text-md)] leading-none ${
            complete
              ? "text-[var(--color-accent)]"
              : "text-[var(--color-ink)]"
          }`}
        >
          {pct}%
        </span>
      </figcaption>

      {/* Track = remaining (visible), fill = paid (accent) */}
      <div
        className="mt-[var(--space-2xs)] h-[12px] overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-track)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`${plan.description}: ${pct} percent paid, ${paidCount} of ${total} months, ฿${fmt(remainingSum)} remaining${finish ? `, finishes ${finish}` : ""}`}
      >
        <div
          className="h-full rounded-[var(--radius-pill)] bg-[var(--color-accent)] transition-[width] duration-[var(--dur-short)] ease-[var(--ease-out)]"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* The "how long to 100%" numbers */}
      <div className="mt-[var(--space-2xs)] flex flex-wrap items-baseline gap-x-[var(--space-xs)] gap-y-[var(--space-3xs)] font-mono tabular-nums text-[length:var(--text-xs)] leading-[var(--leading-table)] text-[var(--color-ink-2)]">
        {complete ? (
          <span className="text-[var(--color-accent)]">
            Complete — all {total} months paid
          </span>
        ) : (
          <>
            <span>
              <span className="text-[var(--color-ink)]">{paidCount}</span>/
              {total} months
            </span>
            <span>
              ฿{fmt(remainingSum)} left of ฿{fmt(totalSum)}
            </span>
            <span>
              {monthsLeft} {monthsLeft === 1 ? "month" : "months"} to go
              {finish ? ` · ends ${finish}` : ""}
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
          <caption>Payment progress for {plan.description}</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Due date</th>
              <th scope="col">Amount (THB)</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {months.map((p) => (
              <tr key={p.id}>
                <th scope="row">{p.paymentMonth}</th>
                <td>{p.dueDate}</td>
                <td>{fmt(p.amount)}</td>
                <td>{p.isPaid ? "Paid" : "Unpaid"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
