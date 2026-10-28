"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaymentPlan } from "@/lib/types";
import { fmt, fmtPassbookDate } from "@/lib/format";
import { nextInstallment, planTotals } from "@/lib/plan";
import { BalanceChart } from "@/components/charts/BalanceChart";
import { PlanProgress } from "@/components/charts/PlanProgress";
import { btnPrimary } from "@/components/ui/styles";

const PAGE_SIZE = 12;

type PaymentRecord = PaymentPlan["payments"][number];

interface PlanCardProps {
  plan: PaymentPlan;
  /** Parent opens its AddPaymentModal (no plan prefill). */
  onAddPayment?: () => void;
  /** Parent opens its AddPaymentModal with this record as `prefill`. */
  onRecordPayment?: (record: PaymentRecord) => void;
}

export function PlanCard({ plan, onAddPayment, onRecordPayment }: PlanCardProps) {
  const [page, setPage] = useState<number | null>(null);

  const { paidSum, remainingSum } = planTotals(plan);
  const next = nextInstallment(plan);
  const sorted = [...plan.payments].sort((a, b) => a.paymentMonth - b.paymentMonth);
  const nextUnpaid = next?.existingRecordId
    ? (sorted.find((p) => p.id === next.existingRecordId) ?? null)
    : null;

  // Running remaining balance after each paid installment.
  const ledger = sorted.reduce<
    { id: string; month: number; date: string; paid: boolean; amount: number; balance: number; cum: number }[]
  >((rows, p) => {
    const cum = (rows.at(-1)?.cum ?? 0) + (p.isPaid ? Number(p.amount) || 0 : 0);
    if (p.id !== next?.existingRecordId) {
      rows.push({
        id: p.id,
        month: p.paymentMonth,
        date: p.isPaid && p.paidDate ? p.paidDate : p.dueDate,
        paid: p.isPaid,
        amount: Number(p.amount) || 0,
        balance: Math.max(Number(plan.totalAmount) - cum, 0),
        cum,
      });
    }
    return rows;
  }, []);

  const totalPages = Math.max(1, Math.ceil(ledger.length / PAGE_SIZE));
  const cur = Math.min(page ?? totalPages, totalPages);
  const paginated = ledger.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE);
  const showDue = next !== null && cur === totalPages;

  const cell = "px-[var(--space-3xs)] py-[var(--space-2xs)] first:pl-[var(--space-xs)] last:pr-[var(--space-xs)] sm:first:pl-[var(--space-sm)] sm:last:pr-[var(--space-sm)]";
  const th = `${cell} text-[length:var(--text-xs)] font-medium leading-[var(--leading-table)] text-[var(--color-ink-2)]`;
  const rowCls = "border-b border-dotted border-[var(--color-leaf-edge)] last:border-b-0";

  return (
    <div className="@container flex min-w-0 flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
      {/* Plan header */}
      <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)] sm:py-[var(--space-xs)]">
        <p
          className="min-w-0 font-display text-[length:var(--text-md)] leading-[var(--leading-tight)] font-medium text-[var(--color-ink)]"
          style={{ overflowWrap: "anywhere" }}
        >
          {plan.description}
        </p>
        <div className="mt-[var(--space-2xs)] flex flex-wrap gap-x-[var(--space-sm)] gap-y-[var(--space-3xs)] text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)]">
          <span>
            งวดละ <span className="font-mono tabular-nums text-[var(--color-ink)]">฿{fmt(plan.monthlyAmount)}</span>
          </span>
          <span>
            คงเหลือ <span className="font-mono tabular-nums text-[var(--color-ink)]">฿{fmt(remainingSum)}</span>
          </span>
          <span className="sr-only">ชำระแล้ว ฿{fmt(paidSum)}</span>
        </div>
      </div>

      {/* Progress + burn-down */}
      <div className="flex flex-col gap-[var(--space-2xs)] border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)]">
        <PlanProgress plan={plan} />
        <BalanceChart plan={plan} />
      </div>

      {/* Passbook — 4 short columns, never scrolls sideways */}
      <table className="w-full table-fixed border-collapse font-mono text-[length:var(--text-xs)] leading-[var(--leading-table)] tabular-nums @min-[28rem]:text-[length:var(--text-sm)]">
        <caption className="sr-only">สมุดบัญชีการชำระ {plan.description}</caption>
        <colgroup>
          <col style={{ width: "27%" }} />
          <col style={{ width: "24%" }} />
          <col style={{ width: "23%" }} />
          <col style={{ width: "26%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-[var(--color-rule)] font-body">
            <th scope="col" className={`${th} text-left`}>วันที่</th>
            <th scope="col" className={`${th} text-left`}>รายการ</th>
            <th scope="col" className={`${th} text-right`}>จ่าย</th>
            <th scope="col" className={`${th} text-right`}>คงเหลือ</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((r) => (
            <tr key={r.id} className={`${rowCls} text-[var(--color-ink)]`}>
              <td className={`${cell} text-left`}>{fmtPassbookDate(r.date)}</td>
              <td className={`${cell} text-left font-body`}>งวด {r.month}</td>
              <td className={`${cell} text-right`}>{r.paid ? fmt(r.amount) : "—"}</td>
              <td className={`${cell} text-right`}>{r.paid ? fmt(r.balance) : "—"}</td>
            </tr>
          ))}
          {showDue && next ? (
            <tr className={`${rowCls} text-[var(--color-danger)]`}>
              <td className={`${cell} text-left`}>{fmtPassbookDate(next.dueDate)}</td>
              <td className={`${cell} text-left font-body`}>
                งวด {next.paymentMonth}
                <span className="block text-[length:var(--text-xs)] font-medium">ครบกำหนด</span>
              </td>
              <td className={`${cell} text-right`}>{fmt(next.amount)}</td>
              <td className={`${cell} text-right`}>—</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      {!next && cur === totalPages ? (
        <p className="border-t border-dotted border-[var(--color-leaf-edge)] px-[var(--space-xs)] py-[var(--space-2xs)] text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)] sm:px-[var(--space-sm)]">
          ชำระครบแล้ว
        </p>
      ) : null}

      {/* Pagination — compact buttons, wraps on mobile instead of overflowing */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-end gap-[var(--space-2xs)] border-t border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:justify-between sm:px-[var(--space-sm)]">
          <p className="hidden text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)] sm:block">
            แสดง {(cur - 1) * PAGE_SIZE + 1}–{Math.min(cur * PAGE_SIZE, ledger.length)} จาก {ledger.length}
          </p>
          <div className="flex flex-wrap items-center gap-[var(--space-3xs)]">
            <button
              onClick={() => setPage(Math.max(1, cur - 1))}
              disabled={cur === 1}
              aria-label="หน้าก่อนหน้า"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-input)] border border-[var(--color-rule)] text-[var(--color-ink-2)] transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] active:translate-y-px disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                aria-current={n === cur ? "page" : undefined}
                className={`flex min-h-[44px] min-w-9 items-center justify-center rounded-[var(--radius-input)] border px-[var(--space-2xs)] text-[length:var(--text-sm)] font-medium leading-none transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] active:translate-y-px ${
                  n === cur
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                    : "border-[var(--color-rule)] text-[var(--color-ink-2)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)]"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, cur + 1))}
              disabled={cur === totalPages}
              aria-label="หน้าถัดไป"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-input)] border border-[var(--color-rule)] text-[var(--color-ink-2)] transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] active:translate-y-px disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {/* Card actions — parent owns the modal */}
      {next && (onAddPayment || onRecordPayment) && (
        <div className="flex flex-wrap items-center justify-between gap-[var(--space-2xs)] border-t border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)]">
          <button
            type="button"
            onClick={() =>
              nextUnpaid && onRecordPayment ? onRecordPayment(nextUnpaid) : onAddPayment?.()
            }
            className={btnPrimary}
          >
            บันทึกการชำระ
          </button>
        </div>
      )}
    </div>
  );
}
