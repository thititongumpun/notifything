/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
import type { PaymentRecord } from "@/lib/types";
import { fmt, fmtDate } from "@/lib/format";

/** Combined monthly bar chart — due (rule) vs paid (accent) per installment
 *  month. Div/flex bars only; screen readers get the sr-only table. */
export function MonthlyBars({ payments }: { payments: PaymentRecord[] }) {
  const months = [...payments].sort(
    (a, b) => a.paymentMonth - b.paymentMonth,
  );
  if (months.length === 0) return null;

  const max = Math.max(...months.map((p) => Number(p.amount)), 1);
  const paidTotal = months
    .filter((p) => p.isPaid)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <figure className="min-w-0">
      <div className="flex items-center justify-between gap-[var(--space-3xs)] min-w-0">
        <figcaption className="text-[length:var(--text-xs)] uppercase tracking-wide text-[var(--color-ink-2)]">
          Monthly amounts
        </figcaption>
        <div className="flex shrink-0 items-center gap-[var(--space-2xs)] font-mono text-[length:var(--text-xs)] text-[var(--color-ink-2)]">
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-[2px] bg-[var(--color-accent)]"
              aria-hidden
            />
            Paid
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-[2px] bg-[var(--color-rule)]"
              aria-hidden
            />
            Due
          </span>
        </div>
      </div>
      <div
        className="mt-[var(--space-3xs)] flex h-[140px] items-end gap-px sm:gap-[var(--space-3xs)] border-b border-[var(--color-rule)]"
        role="img"
        aria-label={`Monthly amounts: paid ฿${fmt(paidTotal)} of ฿${fmt(
          months.reduce((sum, p) => sum + Number(p.amount), 0),
        )} total`}
      >
        {months.map((p) => {
          const due = Number(p.amount);
          const paid = p.isPaid ? due : 0;
          return (
            <div
              key={p.id}
              className="flex h-full min-w-0 flex-1 flex-col justify-end"
              title={`Month ${p.paymentMonth} — due ฿${fmt(due)}, ${p.isPaid ? "paid" : "unpaid"}`}
            >
              {due - paid > 0 && (
                <div
                  className="w-full rounded-t-[2px] bg-[var(--color-rule)]"
                  style={{ height: `${((due - paid) / max) * 100}%` }}
                />
              )}
              {paid > 0 && (
                <div
                  className={`w-full bg-[var(--color-accent)] ${
                    due - paid > 0 ? "" : "rounded-t-[2px]"
                  }`}
                  style={{ height: `${(paid / max) * 100}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Tick + value labels — values thin out below sm */}
      <div className="flex gap-[var(--space-3xs)] border-b border-[var(--color-rule)]">
        {months.map((p) => (
          <div
            key={p.id}
            className="min-w-0 flex-1 py-[var(--space-3xs)] text-center"
          >
            <p className="font-mono tabular-nums text-[length:var(--text-xs)] leading-[var(--leading-table)] text-[var(--color-ink-2)]">
              <span className="sm:hidden">{p.paymentMonth}</span>
              <span className="hidden sm:inline">M{p.paymentMonth}</span>
            </p>
            <p className="mt-[var(--space-3xs)] hidden font-mono tabular-nums text-[length:var(--text-xs)] leading-[var(--leading-table)] text-[var(--color-ink)] sm:block">
              ฿{fmt(p.amount)}
            </p>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>Monthly amounts by installment month</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Due date</th>
            <th scope="col">Due (THB)</th>
            <th scope="col">Paid (THB)</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {months.map((p) => (
            <tr key={p.id}>
              <th scope="row">{p.paymentMonth}</th>
              <td>{fmtDate(p.dueDate)}</td>
              <td>{fmt(p.amount)}</td>
              <td>{p.isPaid ? fmt(p.amount) : "0"}</td>
              <td>{p.isPaid ? "Paid" : "Unpaid"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
