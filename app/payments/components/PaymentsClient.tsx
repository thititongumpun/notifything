/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Plus } from "lucide-react";
import type { JobDetail, PaymentPlan } from "@/lib/types";
import { AddPaymentModal } from "./AddPaymentModal";

const PAGE_SIZE = 12;

function fmt(amount: string | number) {
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

const mono = { fontFamily: "var(--font-mono)" } as const;

function PlanCard({ plan }: { plan: PaymentPlan }) {
  const [page, setPage] = useState(1);

  const paidCount = plan.payments.filter((p) => p.isPaid).length;
  const pct = Math.min(100, Math.round((paidCount / plan.totalMonths) * 100));
  const paidAmount = paidCount * Number(plan.monthlyAmount);
  const remaining = Number(plan.totalAmount) - paidAmount;

  const sorted = [...plan.payments].sort((a, b) => a.paymentMonth - b.paymentMonth);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const nextUnpaid = sorted.find((p) => !p.isPaid) ?? null;

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] transition-[transform,background-color] duration-[180ms] [transition-timing-function:var(--ease-out)] hover:-translate-y-0.5 hover:bg-[var(--color-paper-3)] active:translate-y-px">
      {/* Plan header */}
      <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)] sm:py-[var(--space-xs)]">
        <p
          className="min-w-0 text-sm font-medium text-[var(--color-ink)]"
          style={{ overflowWrap: "anywhere" }}
        >
          {plan.description}
        </p>
        <p className="mt-[var(--space-3xs)] text-xs text-[var(--color-ink-2)]">
          {fmtDate(plan.startDate)} → {fmtDate(plan.endDate)}
        </p>
      </div>

      {/* Next payment — the single accent element on the card */}
      <div className="flex items-baseline justify-between gap-[var(--space-2xs)] border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)]">
        <p className="text-xs text-[var(--color-ink-2)]">Next payment</p>
        <p
          className="text-sm font-medium text-[var(--color-accent)]"
          style={{ overflowWrap: "anywhere" }}
        >
          {nextUnpaid ? fmtDate(nextUnpaid.dueDate) : "All paid"}
        </p>
      </div>

      {/* Summary stats — amounts in mono */}
      <div className="grid grid-cols-2 gap-[var(--space-2xs)] border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:grid-cols-4 sm:px-[var(--space-sm)] sm:py-[var(--space-xs)]">
        <div className="min-w-0">
          <p className="text-xs text-[var(--color-ink-2)]">Total</p>
          <p className="mt-[var(--space-3xs)] text-sm font-semibold text-[var(--color-ink)]" style={mono}>
            ฿{fmt(plan.totalAmount)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-[var(--color-ink-2)]">Monthly</p>
          <p className="mt-[var(--space-3xs)] text-sm font-semibold text-[var(--color-ink)]" style={mono}>
            ฿{fmt(plan.monthlyAmount)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-[var(--color-ink-2)]">Paid</p>
          <p className="mt-[var(--space-3xs)] text-sm font-semibold text-[var(--color-ink)]" style={mono}>
            ฿{fmt(paidAmount)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-[var(--color-ink-2)]">Remaining</p>
          <p className="mt-[var(--space-3xs)] text-sm font-semibold text-[var(--color-ink)]" style={mono}>
            ฿{fmt(remaining)}
          </p>
        </div>
      </div>

      {/* Progress — 4px accent-on-rule bar */}
      <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)]">
        <div className="mb-[var(--space-3xs)] flex items-center justify-between text-xs text-[var(--color-ink-2)]">
          <span>
            {paidCount} of {plan.totalMonths} months paid
          </span>
          <span style={mono}>{pct}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-rule)]">
          <div
            className="h-full rounded-full bg-[var(--color-accent)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Payments table — Notes and Paid Date collapse away below md (no horizontal scroll) */}
      <div className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-rule)]">
              <th className="px-[var(--space-xs)] py-[var(--space-2xs)] text-left text-xs font-medium text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">#</th>
              <th className="px-[var(--space-xs)] py-[var(--space-2xs)] text-left text-xs font-medium text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">Due Date</th>
              <th className="px-[var(--space-xs)] py-[var(--space-2xs)] text-right text-xs font-medium text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">Amount</th>
              <th className="px-[var(--space-xs)] py-[var(--space-2xs)] text-left text-xs font-medium text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">Status</th>
              <th className="hidden px-[var(--space-sm)] py-[var(--space-2xs)] text-left text-xs font-medium text-[var(--color-ink-2)] md:table-cell">Paid Date</th>
              <th className="hidden px-[var(--space-sm)] py-[var(--space-2xs)] text-left text-xs font-medium text-[var(--color-ink-2)] md:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-[var(--color-rule)] last:border-b-0 transition-colors duration-[180ms] [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-paper-3)]"
              >
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] text-[var(--color-ink-2)] tabular-nums sm:px-[var(--space-sm)]" style={mono}>
                  {payment.paymentMonth}
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] text-[var(--color-ink)] sm:px-[var(--space-sm)]">
                  {fmtDate(payment.dueDate)}
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] text-right text-[var(--color-ink)] sm:px-[var(--space-sm)]" style={mono}>
                  ฿{fmt(payment.amount)}
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)]">
                  {payment.isPaid ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--color-ink)]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--color-ink-2)]">
                      <Circle className="h-3.5 w-3.5" aria-hidden />
                      Unpaid
                    </span>
                  )}
                </td>
                <td className="hidden px-[var(--space-sm)] py-[var(--space-2xs)] text-xs text-[var(--color-ink-2)] md:table-cell">
                  {fmtDate(payment.paidDate)}
                </td>
                <td className="hidden max-w-[16rem] px-[var(--space-sm)] py-[var(--space-2xs)] text-xs text-[var(--color-ink-2)] md:table-cell">
                  <span style={{ overflowWrap: "anywhere" }}>{payment.notes || "—"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)]">
          <p className="text-xs text-[var(--color-ink-2)]">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of{" "}
            {sorted.length}
          </p>
          <div className="flex items-center gap-[var(--space-3xs)]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-input)] border border-[var(--color-rule)] text-[var(--color-ink-2)] transition-colors duration-[180ms] [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] active:translate-y-px disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-input)] border text-xs font-medium transition-colors duration-[180ms] [transition-timing-function:var(--ease-out)] active:translate-y-px ${
                  n === page
                    ? "border-[var(--color-rule)] bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
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
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-input)] border border-[var(--color-rule)] text-[var(--color-ink-2)] transition-colors duration-[180ms] [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] active:translate-y-px disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PaymentsClient({ jobs }: { jobs: JobDetail[] }) {
  const router = useRouter();
  const [activePlan, setActivePlan] = useState<PaymentPlan | null>(null);

  function handleSuccess() {
    setActivePlan(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-[var(--space-md)]">
        {jobs.map((job) => (
          <div key={job.id} className="flex min-w-0 flex-col gap-[var(--space-xs)]">
            <div className="flex flex-wrap items-center justify-between gap-[var(--space-2xs)]">
              <h2
                className="min-w-0 text-lg font-semibold text-[var(--color-ink)]"
                style={{ letterSpacing: "-0.02em", overflowWrap: "anywhere" }}
              >
                {job.name}
              </h2>
              {job.paymentPlans.map((plan) => (
                <Button
                  key={plan.id}
                  size="sm"
                  aria-label={`Add payment to ${plan.description}`}
                  className="min-h-[44px] gap-1.5 rounded-[10px] bg-[var(--color-accent)] px-[var(--space-xs)] text-[var(--color-accent-ink)] font-medium transition-[transform,background-color] duration-[180ms] [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-focus)] active:translate-y-px"
                  onPress={() => setActivePlan(plan)}
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                  Add payment
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-[var(--space-xs)] md:[grid-template-columns:repeat(2,minmax(0,1fr))]">
              {job.paymentPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {activePlan ? (
        <AddPaymentModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          onSuccess={handleSuccess}
        />
      ) : null}
    </>
  );
}
