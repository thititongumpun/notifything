import { bkkParts } from "./format";
import type { JobDetail, PaymentPlan } from "./types";

export type NextInstallment = { paymentMonth: number; dueDate: string; amount: number; existingRecordId: string | null };
export type Urgent = { job: JobDetail; plan: PaymentPlan; next: NextInstallment };

const BKK_MS = 7 * 3_600_000;
const DAY_MS = 86_400_000;

/** +1 calendar month on the Bangkok date, day clamped, Bangkok time of day kept. */
function addBkkMonth(iso: string): string {
  const t = new Date(iso).getTime();
  const p = bkkParts(new Date(t));
  const tod = (((t + BKK_MS) % DAY_MS) + DAY_MS) % DAY_MS;
  const monthIdx = p.month; // 0-based index of next month
  const day = Math.min(p.day, new Date(Date.UTC(p.year, monthIdx + 1, 0)).getUTCDate());
  return new Date(Date.UTC(p.year, monthIdx, day) - BKK_MS + tod).toISOString();
}

export function nextInstallment(plan: PaymentPlan): NextInstallment | null {
  const recs = [...plan.payments].sort((a, b) => a.paymentMonth - b.paymentMonth);
  const unpaid = recs.find((r) => !r.isPaid);
  if (unpaid) {
    return {
      paymentMonth: unpaid.paymentMonth,
      dueDate: new Date(unpaid.dueDate).toISOString(),
      amount: Number(unpaid.amount),
      existingRecordId: unpaid.id,
    };
  }
  if (recs.length >= plan.totalMonths) return null;
  const last = recs[recs.length - 1];
  return {
    paymentMonth: last ? last.paymentMonth + 1 : 1,
    dueDate: last ? addBkkMonth(last.dueDate) : new Date(plan.startDate).toISOString(),
    amount: Number(plan.monthlyAmount),
    existingRecordId: null,
  };
}

export function planTotals(plan: PaymentPlan) {
  const total = plan.totalMonths || plan.payments.length;
  const paid = plan.payments.filter((p) => p.isPaid);
  const paidCount = paid.length;
  const paidSum = paid.reduce((s, p) => s + Number(p.amount), 0);
  // "Left" is against the plan's full total: records only exist for billed months.
  const totalSum = Number(plan.totalAmount);
  return {
    paidCount,
    totalMonths: total,
    paidSum,
    totalSum,
    remainingSum: Math.max(0, totalSum - paidSum),
    monthsLeft: Math.max(0, total - paidCount),
    pct: total ? Math.min(100, Math.round((paidCount / total) * 100)) : 0,
  };
}

export function mostUrgent(details: JobDetail[]): Urgent | null {
  let best: Urgent | null = null;
  for (const job of details)
    for (const plan of job.paymentPlans) {
      const next = nextInstallment(plan);
      if (next && (!best || next.dueDate < best.next.dueDate)) best = { job, plan, next };
    }
  return best;
}
