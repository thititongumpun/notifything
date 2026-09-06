/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaymentPlan } from "@/lib/types";
import { fmt, fmtDate } from "@/lib/format";
import { BalanceChart } from "@/components/charts/BalanceChart";

const PAGE_SIZE = 12;

type PaymentRecord = PaymentPlan["payments"][number];

interface PlanCardProps {
  plan: PaymentPlan;
  /** Parent opens its AddPaymentModal (no plan prefill). */
  onAddPayment?: () => void;
  /** Parent opens its AddPaymentModal with this record as `prefill`. */
  onRecordPayment?: (record: PaymentRecord) => void;
}

function StatusPill({ isPaid }: { isPaid: boolean }) {
  return isPaid ? (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--color-accent)] px-2 py-1 text-[length:var(--text-xs)] font-medium leading-none text-[var(--color-accent)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
      Paid
    </span>
  ) : (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--color-rule)] px-2 py-1 text-[length:var(--text-xs)] font-medium leading-none text-[var(--color-ink-2)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-rule)]" aria-hidden />
      Unpaid
    </span>
  );
}

export function PlanCard({ plan, onAddPayment, onRecordPayment }: PlanCardProps) {
  const [page, setPage] = useState(1);

  const paidCount = plan.payments.filter((p) => p.isPaid).length;
  const pct = Math.min(100, Math.round((paidCount / plan.totalMonths) * 100));

  const sorted = [...plan.payments].sort((a, b) => a.paymentMonth - b.paymentMonth);

  // Running remaining balance after each installment. Unlike the flat monthly
  // amount (identical on every row), this changes every month and shows
  // actual payoff progress.
  const balanceAfter = new Map<string, number>();
  let cumPaid = 0;
  for (const p of sorted) {
    if (p.isPaid) cumPaid += Number(p.amount) || 0;
    balanceAfter.set(p.id, Math.max(Number(plan.totalAmount) - cumPaid, 0));
  }
  const paidAmount = cumPaid;
  const remaining = Math.max(Number(plan.totalAmount) - paidAmount, 0);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const nextUnpaid = sorted.find((p) => !p.isPaid) ?? null;

  return (
    <div className="@container flex min-w-0 flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] transition-[transform,background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:bg-[var(--color-paper-3)] active:translate-y-px">
      {/* Plan header */}
      <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)] sm:py-[var(--space-xs)]">
        <p
          className="min-w-0 text-[length:var(--text-sm)] leading-[var(--leading-body)] font-medium text-[var(--color-ink)]"
          style={{ overflowWrap: "anywhere" }}
        >
          {plan.description}
        </p>
        <p className="mt-[var(--space-3xs)] text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)]">
          <span className="font-mono tabular-nums">{fmtDate(plan.startDate)} → {fmtDate(plan.endDate)}</span>
        </p>
      </div>

      {/* Summary stats — amounts in mono */}
      <div className="grid grid-cols-2 gap-[var(--space-2xs)] border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] @min-[28rem]:grid-cols-4 sm:px-[var(--space-sm)] sm:py-[var(--space-xs)]">
        <div className="min-w-0">
          <p className="text-[length:var(--text-xs)] uppercase tracking-wide leading-[var(--leading-body)] text-[var(--color-ink-2)]">Total</p>
          <p className="mt-[var(--space-3xs)] text-[length:var(--text-sm)] leading-[var(--leading-body)] font-semibold text-[var(--color-ink)] font-mono [overflow-wrap:anywhere]">
            ฿{fmt(plan.totalAmount)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[length:var(--text-xs)] uppercase tracking-wide leading-[var(--leading-body)] text-[var(--color-ink-2)]">Monthly</p>
          <p className="mt-[var(--space-3xs)] text-[length:var(--text-sm)] leading-[var(--leading-body)] font-semibold text-[var(--color-ink)] font-mono [overflow-wrap:anywhere]">
            ฿{fmt(plan.monthlyAmount)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[length:var(--text-xs)] uppercase tracking-wide leading-[var(--leading-body)] text-[var(--color-ink-2)]">Paid</p>
          <p className="mt-[var(--space-3xs)] text-[length:var(--text-sm)] leading-[var(--leading-body)] font-semibold text-[var(--color-ink)] font-mono [overflow-wrap:anywhere]">
            ฿{fmt(paidAmount)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[length:var(--text-xs)] uppercase tracking-wide leading-[var(--leading-body)] text-[var(--color-ink-2)]">Remaining</p>
          <p className="mt-[var(--space-3xs)] text-[length:var(--text-sm)] leading-[var(--leading-body)] font-semibold text-[var(--color-ink)] font-mono [overflow-wrap:anywhere]">
            ฿{fmt(remaining)}
          </p>
        </div>
      </div>

      {/* Progress — months paid + remaining-balance burn-down. A flat bar
          (or one equal segment per installment) carries no information for a
          fixed installment plan; the running balance drops every month. */}
      <div className="flex flex-col gap-[var(--space-3xs)] border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)]">
        <div className="flex items-center justify-between text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)]">
          <span>
            {paidCount} of {plan.totalMonths} months paid
          </span>
          <span className="font-mono tabular-nums">{pct}%</span>
        </div>
        <BalanceChart plan={plan} />
      </div>

      {/* Payments — desktop table */}
      <div className="hidden overflow-x-auto @min-[44rem]:block">
        <table className="w-full text-[length:var(--text-sm)] leading-[var(--leading-table)]">
          <thead>
            <tr className="border-b border-[var(--color-rule)]">
              <th className="px-[var(--space-xs)] py-[var(--space-2xs)] text-left text-[length:var(--text-xs)] leading-[var(--leading-table)] font-medium uppercase tracking-wide text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">#</th>
              <th className="px-[var(--space-xs)] py-[var(--space-2xs)] text-left text-[length:var(--text-xs)] leading-[var(--leading-table)] font-medium uppercase tracking-wide text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">Due Date</th>
              <th className="px-[var(--space-xs)] py-[var(--space-2xs)] text-right text-[length:var(--text-xs)] leading-[var(--leading-table)] font-medium uppercase tracking-wide text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">Balance After</th>
              <th className="px-[var(--space-xs)] py-[var(--space-2xs)] text-left text-[length:var(--text-xs)] leading-[var(--leading-table)] font-medium uppercase tracking-wide text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">Status</th>
              <th className="px-[var(--space-xs)] py-[var(--space-2xs)] text-left text-[length:var(--text-xs)] leading-[var(--leading-table)] font-medium uppercase tracking-wide text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">Paid Date</th>
              <th className="px-[var(--space-xs)] py-[var(--space-2xs)] text-left text-[length:var(--text-xs)] leading-[var(--leading-table)] font-medium uppercase tracking-wide text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">Notes</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-[var(--color-rule)] last:border-b-0 transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-3)]"
              >
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] font-mono tabular-nums text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">
                  {payment.paymentMonth}
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] font-mono tabular-nums text-[var(--color-ink)] sm:px-[var(--space-sm)]">
                  {fmtDate(payment.dueDate)}
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] text-right font-mono tabular-nums text-[var(--color-ink)] sm:px-[var(--space-sm)]">
                  ฿{fmt(balanceAfter.get(payment.id) ?? 0)}
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)]">
                  <StatusPill isPaid={payment.isPaid} />
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] font-mono tabular-nums text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">
                  {fmtDate(payment.paidDate)}
                </td>
                <td className="max-w-[16rem] px-[var(--space-xs)] py-[var(--space-2xs)] text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">
                  <span style={{ overflowWrap: "anywhere" }}>{payment.notes || "—"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payments — mobile stacked cards */}
      <div className="flex flex-col @min-[44rem]:hidden">
        {paginated.map((payment) => (
          <div
            key={payment.id}
            className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] last:border-b-0 sm:px-[var(--space-sm)]"
          >
            <div className="flex min-w-0 items-start justify-between gap-[var(--space-2xs)]">
              <p className="text-[length:var(--text-sm)] leading-[var(--leading-table)] font-mono tabular-nums text-[var(--color-ink)] [overflow-wrap:anywhere]">
                #{payment.paymentMonth} · ฿{fmt(balanceAfter.get(payment.id) ?? 0)} left
              </p>
              <StatusPill isPaid={payment.isPaid} />
            </div>
            <dl className="mt-[var(--space-3xs)] flex flex-col gap-[var(--space-3xs)] text-[length:var(--text-sm)] leading-[var(--leading-table)]">
              <div className="flex min-w-0 gap-[var(--space-3xs)]">
                <dt className="shrink-0 text-[length:var(--text-xs)] uppercase tracking-wide leading-[var(--leading-table)] text-[var(--color-ink-2)]">Due</dt>
                <dd className="font-mono tabular-nums text-[var(--color-ink)]">{fmtDate(payment.dueDate)}</dd>
              </div>
              <div className="flex min-w-0 gap-[var(--space-3xs)]">
                <dt className="shrink-0 text-[length:var(--text-xs)] uppercase tracking-wide leading-[var(--leading-table)] text-[var(--color-ink-2)]">Paid</dt>
                <dd className="font-mono tabular-nums text-[var(--color-ink-2)]">{fmtDate(payment.paidDate)}</dd>
              </div>
              {payment.notes && (
                <div className="flex min-w-0 gap-[var(--space-3xs)]">
                  <dt className="shrink-0 text-[length:var(--text-xs)] uppercase tracking-wide leading-[var(--leading-table)] text-[var(--color-ink-2)]">Notes</dt>
                  <dd className="min-w-0 text-[var(--color-ink-2)]" style={{ overflowWrap: "anywhere" }}>{payment.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        ))}
      </div>

      {/* Pagination — compact buttons, wraps on mobile instead of overflowing */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-end gap-[var(--space-2xs)] border-t border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:justify-between sm:px-[var(--space-sm)]">
          <p className="hidden text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)] sm:block">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of{" "}
            {sorted.length}
          </p>
          <div className="flex flex-wrap items-center gap-[var(--space-3xs)]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-input)] border border-[var(--color-rule)] text-[var(--color-ink-2)] transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] active:translate-y-px disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={`flex min-h-[44px] min-w-9 items-center justify-center rounded-[var(--radius-input)] border px-[var(--space-2xs)] text-[length:var(--text-sm)] font-medium leading-none transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] active:translate-y-px ${
                  n === page
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                    : "border-[var(--color-rule)] text-[var(--color-ink-2)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)]"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-input)] border border-[var(--color-rule)] text-[var(--color-ink-2)] transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] active:translate-y-px disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {/* Card actions — parent owns the modal */}
      {(onAddPayment || onRecordPayment) && (
        <div className="flex flex-wrap items-center justify-between gap-[var(--space-2xs)] border-t border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)]">
          {onAddPayment ? (
            <button
              type="button"
              onClick={onAddPayment}
              className="min-h-[44px] rounded-[10px] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-[var(--space-sm)] text-[length:var(--text-sm)] leading-none font-medium text-[var(--color-ink)] transition-[transform,background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-3)] active:translate-y-px"
            >
              Add payment
            </button>
          ) : null}
          {nextUnpaid && onRecordPayment ? (
            <button
              type="button"
              onClick={() => onRecordPayment(nextUnpaid)}
              className="min-h-[44px] rounded-[10px] bg-[var(--color-accent)] px-[var(--space-sm)] text-[length:var(--text-sm)] leading-none font-medium text-[var(--color-accent-ink)] transition-[transform,background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-focus)] active:translate-y-px"
            >
              Record next payment
            </button>
          ) : !nextUnpaid ? (
            <p className="text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)]">
              All payments recorded
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
