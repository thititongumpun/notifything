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
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
      {/* Plan header */}
      <div className="px-5 py-4 border-b border-neutral-800">
        <p className="text-sm font-medium text-white">{plan.description}</p>
        <p className="text-xs text-neutral-400 mt-0.5">
          {fmtDate(plan.startDate)} → {fmtDate(plan.endDate)}
        </p>
      </div>

      {/* Summary stats */}
      <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-neutral-800">
        <div>
          <p className="text-xs text-neutral-400">Total</p>
          <p className="text-sm font-semibold text-white mt-0.5">฿{fmt(plan.totalAmount)}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-400">Monthly</p>
          <p className="text-sm font-semibold text-white mt-0.5">฿{fmt(plan.monthlyAmount)}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-400">Paid</p>
          <p className="text-sm font-semibold text-emerald-400 mt-0.5">฿{paidAmount.toLocaleString("th-TH")}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-400">Remaining</p>
          <p className={`text-sm font-semibold mt-0.5 ${remaining > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            ฿{remaining.toLocaleString("th-TH")}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-3 border-b border-neutral-800">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
          <span>{paidCount} of {plan.totalMonths} months paid</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Payments table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">#</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">Due Date</th>
              <th className="text-right px-5 py-2.5 text-xs font-medium text-neutral-400">Amount</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">Status</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">Paid Date</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {paginated.map((payment) => (
              <tr
                key={payment.id}
                className={`transition-colors ${payment.isPaid ? "hover:bg-neutral-800/30" : "hover:bg-neutral-800/50"}`}
              >
                <td className="px-5 py-3 text-neutral-500 tabular-nums">{payment.paymentMonth}</td>
                <td className="px-5 py-3 text-neutral-300">{fmtDate(payment.dueDate)}</td>
                <td className="px-5 py-3 text-right font-mono text-neutral-300">
                  ฿{fmt(payment.amount)}
                </td>
                <td className="px-5 py-3">
                  {payment.isPaid ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
                      <Circle className="w-3.5 h-3.5" />
                      Unpaid
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-neutral-400 text-xs">{fmtDate(payment.paidDate)}</td>
                <td className="px-5 py-3 text-neutral-500 text-xs">{payment.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-neutral-800 flex items-center justify-between">
          <p className="text-xs text-neutral-400">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  n === page
                    ? "bg-indigo-500 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
