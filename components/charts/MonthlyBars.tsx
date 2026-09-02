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
  const tickStep = Math.max(1, Math.ceil(months.length / 6));
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
              className="h-2 w-2 rounded-[2px] bg-[var(--color-track)]"
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
                  className="w-full rounded-t-[2px] bg-[var(--color-track)]"
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
      {/* Tick labels — thinned to ~6 via tickStep. Per-month ฿ figures were
          dropped from this row (see ponytail note below); the sr-only table
          and the plan's aggregate paid/total elsewhere on the card still
          carry that data.
          ponytail: the label is positioned absolute (see cell comment
          below), which pulls it out of normal flow — an auto-height row
          would collapse to its padding alone and, combined with
          overflow-hidden, clip the label vertically. h-[...] pins the row
          (border-box, so padding is included in the sum) to exactly
          padding + one text-xs/leading-table line so that can't happen;
          ceiling: fixed to one line, doesn't grow if this row ever gets a
          second line of content. */}
      <div className="flex h-[calc(2*var(--space-3xs)+var(--text-xs)*var(--leading-table))] gap-px overflow-hidden py-[var(--space-3xs)] sm:gap-[var(--space-3xs)] border-b border-[var(--color-rule)]">
        {months.map((p, i) => {
          const showTick = i % tickStep === 0 || i === months.length - 1;
          return (
            <div
              key={p.id}
              // ponytail: a flex-1 cell here is only ~1/n of the chart's
              // width (e.g. ~12px per bar at 60 months on a 1280px chart),
              // far under what a label like "M60" needs (~22px). Cell-level
              // overflow-hidden can't fix that — CSS clips text mid-glyph,
              // not by whole run, so it used to render sliced digits, not a
              // hidden or legibly-truncated label. Fix: the label is
              // absolutely positioned at full natural width, so it overlaps
              // neighbouring (usually empty, thanks to tickStep) cells
              // instead of being clipped; overflow-hidden moved up to the
              // row so the first/last label still can't push page width.
              // The first/last cell anchor their label to the outer edge
              // (left-0 / right-0) instead of centring it — centring would
              // put half the label's width past the row's own edge, which
              // the row's overflow-hidden would then clip. Ceiling: if
              // tickStep ever schedules two adjacent bars to both show a
              // label, their full-width overlays can visually collide.
              // Upgrade path: derive tickStep from measured per-bar width
              // (container query or ResizeObserver) instead of the fixed
              // months.length/6 estimate, so consecutive labels are never
              // both shown when they wouldn't fit side by side.
              className="relative min-w-0 flex-1 text-center"
            >
              {showTick &&
                (i === 0 ? (
                  <p className="absolute left-0 whitespace-nowrap font-mono tabular-nums text-[length:var(--text-xs)] leading-[var(--leading-table)] text-[var(--color-ink-2)]">
                    <span className="sm:hidden">{p.paymentMonth}</span>
                    <span className="hidden sm:inline">M{p.paymentMonth}</span>
                  </p>
                ) : i === months.length - 1 ? (
                  <p className="absolute right-0 whitespace-nowrap font-mono tabular-nums text-[length:var(--text-xs)] leading-[var(--leading-table)] text-[var(--color-ink-2)]">
                    <span className="sm:hidden">{p.paymentMonth}</span>
                    <span className="hidden sm:inline">M{p.paymentMonth}</span>
                  </p>
                ) : (
                  <p className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono tabular-nums text-[length:var(--text-xs)] leading-[var(--leading-table)] text-[var(--color-ink-2)]">
                    <span className="sm:hidden">{p.paymentMonth}</span>
                    <span className="hidden sm:inline">M{p.paymentMonth}</span>
                  </p>
                ))}
            </div>
          );
        })}
      </div>
      {/* ponytail: sr-only lives on this wrapping div, not the table — a
          <table>'s used width is max(specified, min-content) per CSS table
          sizing, so `width:1px` on the table itself can't shrink it (it
          stays ~770px wide and blows out scrollWidth). Collapsing a block
          box around it is the correct fix; don't move the class back onto
          the table. */}
      <div className="sr-only">
        <table>
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
      </div>
    </figure>
  );
}
