/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
import type { PaymentPlan } from "@/lib/types";
import { fmt, fmtDate } from "@/lib/format";

/** Per-plan segmented progress bar — one segment per installment month,
 *  paid = accent, unpaid = rule. Screen readers get the sr-only table. */
export function PlanProgress({ plan }: { plan: PaymentPlan }) {
  const months = [...plan.payments].sort(
    (a, b) => a.paymentMonth - b.paymentMonth,
  );
  const total = plan.totalMonths || months.length;
  const paidCount = months.filter((p) => p.isPaid).length;
  const pct = total > 0 ? Math.min(100, Math.round((paidCount / total) * 100)) : 0;

  return (
    <figure className="min-w-0">
      <figcaption className="flex items-baseline justify-between gap-[var(--space-2xs)] min-w-0">
        <span className="text-[length:var(--text-sm)] font-medium leading-[var(--leading-table)] text-[var(--color-ink)] min-w-0 truncate">
          {plan.description}
        </span>
        <span className="shrink-0 font-mono tabular-nums text-[length:var(--text-xs)] text-[var(--color-ink-2)]">
          {paidCount}/{total} · {pct}%
        </span>
      </figcaption>
      <div
        className="mt-[var(--space-3xs)] flex h-[10px] gap-px"
        role="img"
        aria-label={`${plan.description}: ${paidCount} of ${total} months paid, ${pct} percent`}
      >
        {months.map((p) => (
          <div
            key={p.id}
            className={`min-w-0 flex-1 rounded-[var(--radius-pill)] ${
              p.isPaid
                ? "bg-[var(--color-accent)]"
                : "bg-[var(--color-rule)]"
            }`}
          />
        ))}
      </div>
      <table className="sr-only">
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
              <td>{fmtDate(p.dueDate)}</td>
              <td>{fmt(p.amount)}</td>
              <td>{p.isPaid ? "Paid" : "Unpaid"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
