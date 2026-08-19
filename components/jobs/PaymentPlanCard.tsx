/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
"use client";

import { useState } from "react";
import type { PaymentPlan } from "@/lib/types";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

function fmt(amount: string) {
  return Number(amount).toLocaleString("th-TH");
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PaymentPlanCard({ plan }: { plan: PaymentPlan }) {
  const [page, setPage] = useState(1);

  const paidCount = plan.payments.filter((p) => p.isPaid).length;
  const pct = Math.round((paidCount / plan.totalMonths) * 100);
  const paidAmount = paidCount * Number(plan.monthlyAmount);
  const remaining = Number(plan.totalAmount) - paidAmount;

  const sorted = [...plan.payments].sort((a, b) => a.paymentMonth - b.paymentMonth);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] overflow-hidden">
      {/* Plan header */}
      <div className="px-[var(--space-xs)] py-[var(--space-2xs)] border-b border-[var(--color-rule)]">
        <p className="text-[length:var(--text-sm)] font-medium text-[var(--color-ink)] min-w-0 [overflow-wrap:anywhere]">
          {plan.description}
        </p>
        <p className="font-mono text-[length:var(--text-xs)] text-[var(--color-ink-2)] mt-[var(--space-3xs)]">
          {fmtDate(plan.startDate)} → {fmtDate(plan.endDate)}
        </p>
      </div>

      {/* Summary stats */}
      <div className="px-[var(--space-xs)] py-[var(--space-2xs)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] gap-[var(--space-2xs)] border-b border-[var(--color-rule)]">
        <div className="min-w-0">
          <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)]">Total</p>
          <p className="font-mono text-[length:var(--text-sm)] font-semibold text-[var(--color-ink)] mt-[var(--space-3xs)]">฿{fmt(plan.totalAmount)}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)]">Monthly</p>
          <p className="font-mono text-[length:var(--text-sm)] font-semibold text-[var(--color-ink)] mt-[var(--space-3xs)]">฿{fmt(plan.monthlyAmount)}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)]">Paid</p>
          <p className="font-mono text-[length:var(--text-sm)] font-semibold text-[var(--color-accent)] mt-[var(--space-3xs)]">฿{paidAmount.toLocaleString("th-TH")}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)]">Remaining</p>
          <p className="font-mono text-[length:var(--text-sm)] font-semibold text-[var(--color-ink)] mt-[var(--space-3xs)]">฿{remaining.toLocaleString("th-TH")}</p>
        </div>
      </div>

      {/* Progress bar — 4px accent-on-rule */}
      <div className="px-[var(--space-xs)] py-[var(--space-2xs)] border-b border-[var(--color-rule)]">
        <div className="flex items-center justify-between font-mono text-[length:var(--text-xs)] text-[var(--color-ink-2)] mb-[var(--space-3xs)]">
          <span>{paidCount} of {plan.totalMonths} months paid</span>
          <span>{pct}%</span>
        </div>
        <div className="bg-[var(--color-rule)] rounded-full overflow-hidden" style={{ height: 4 }}>
          <div
            className="h-full rounded-full bg-[var(--color-accent)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Payments — desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-[length:var(--text-sm)]">
          <thead>
            <tr className="border-b border-[var(--color-rule)]">
              <th className="text-left px-[var(--space-xs)] py-[var(--space-3xs)] text-[length:var(--text-xs)] font-medium uppercase tracking-wide text-[var(--color-ink-2)]">#</th>
              <th className="text-left px-[var(--space-xs)] py-[var(--space-3xs)] text-[length:var(--text-xs)] font-medium uppercase tracking-wide text-[var(--color-ink-2)]">Due Date</th>
              <th className="text-right px-[var(--space-xs)] py-[var(--space-3xs)] text-[length:var(--text-xs)] font-medium uppercase tracking-wide text-[var(--color-ink-2)]">Amount</th>
              <th className="text-left px-[var(--space-xs)] py-[var(--space-3xs)] text-[length:var(--text-xs)] font-medium uppercase tracking-wide text-[var(--color-ink-2)]">Status</th>
              <th className="text-left px-[var(--space-xs)] py-[var(--space-3xs)] text-[length:var(--text-xs)] font-medium uppercase tracking-wide text-[var(--color-ink-2)]">Paid Date</th>
              <th className="text-left px-[var(--space-xs)] py-[var(--space-3xs)] text-[length:var(--text-xs)] font-medium uppercase tracking-wide text-[var(--color-ink-2)]">Notes</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-[var(--color-rule)] last:border-b-0 transition-[background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-3)]"
              >
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] font-mono text-[var(--color-ink-2)] tabular-nums">{payment.paymentMonth}</td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] text-[var(--color-ink)]">{fmtDate(payment.dueDate)}</td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] text-right font-mono text-[var(--color-ink)]">
                  ฿{fmt(payment.amount)}
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)]">
                  {payment.isPaid ? (
                    <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--color-accent)] text-[length:var(--text-xs)] font-medium text-[var(--color-accent)] leading-none px-2 py-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--color-rule)] text-[length:var(--text-xs)] font-medium text-[var(--color-ink-2)] leading-none px-2 py-1">
                      <Circle className="w-3.5 h-3.5" />
                      Unpaid
                    </span>
                  )}
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] text-[length:var(--text-xs)] text-[var(--color-ink-2)]">{fmtDate(payment.paidDate)}</td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] text-[length:var(--text-xs)] text-[var(--color-ink-2)]">{payment.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payments — mobile stacked cards */}
      <div className="md:hidden flex flex-col">
        {paginated.map((payment) => (
          <div
            key={payment.id}
            className="px-[var(--space-xs)] py-[var(--space-2xs)] border-b border-[var(--color-rule)] last:border-b-0"
          >
            <div className="flex items-start justify-between gap-[var(--space-2xs)] min-w-0">
              <p className="font-mono text-[length:var(--text-sm)] text-[var(--color-ink)] tabular-nums">
                #{payment.paymentMonth} · ฿{fmt(payment.amount)}
              </p>
              {payment.isPaid ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--color-accent)] text-[length:var(--text-xs)] font-medium text-[var(--color-accent)] leading-none px-2 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Paid
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--color-rule)] text-[length:var(--text-xs)] font-medium text-[var(--color-ink-2)] leading-none px-2 py-1">
                  <Circle className="w-3.5 h-3.5" />
                  Unpaid
                </span>
              )}
            </div>
            <dl className="mt-[var(--space-3xs)] flex flex-col gap-[var(--space-3xs)] text-[length:var(--text-xs)]">
              <div className="flex gap-[var(--space-3xs)] min-w-0">
                <dt className="uppercase tracking-wide text-[var(--color-ink-2)] shrink-0">Due</dt>
                <dd className="text-[var(--color-ink)]">{fmtDate(payment.dueDate)}</dd>
              </div>
              <div className="flex gap-[var(--space-3xs)] min-w-0">
                <dt className="uppercase tracking-wide text-[var(--color-ink-2)] shrink-0">Paid</dt>
                <dd className="text-[var(--color-ink-2)]">{fmtDate(payment.paidDate)}</dd>
              </div>
              {payment.notes && (
                <div className="flex gap-[var(--space-3xs)] min-w-0">
                  <dt className="uppercase tracking-wide text-[var(--color-ink-2)] shrink-0">Notes</dt>
                  <dd className="text-[var(--color-ink-2)] min-w-0 [overflow-wrap:anywhere]">{payment.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-[var(--space-xs)] py-[var(--space-2xs)] border-t border-[var(--color-rule)] flex items-center justify-between gap-[var(--space-2xs)]">
          <p className="font-mono text-[length:var(--text-xs)] text-[var(--color-ink-2)]">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-[var(--space-3xs)]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[var(--radius-input)] border border-[var(--color-rule)] text-[var(--color-ink-2)] transition-[transform,background-color,color] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] active:translate-y-[1px] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-[44px] h-[44px] rounded-[var(--radius-input)] border text-[length:var(--text-sm)] font-medium transition-[transform,background-color,color,border-color] duration-[var(--dur-short)] ease-[var(--ease-out)] active:translate-y-[1px] ${
                  n === page
                    ? "border-[var(--color-accent)] text-[var(--color-accent)]"
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
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[var(--radius-input)] border border-[var(--color-rule)] text-[var(--color-ink-2)] transition-[transform,background-color,color] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] active:translate-y-[1px] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
