import assert from "node:assert/strict";
import { mostUrgent, nextInstallment, planTotals } from "./plan";
import type { JobDetail, PaymentPlan } from "./types";

// Run: npx tsx lib/plan.test.ts  (exits non-zero on any mismatch)
function addMonths(iso: string, n: number) {
  const d = new Date(iso);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString();
}
function mkPlan(o: { total?: string; monthly?: string; months?: number; start?: string; paid?: number } = {}): PaymentPlan {
  const { total = "750000", monthly = "14828", months = 48, start = "2025-01-05T05:00:00Z", paid = 0 } = o;
  return {
    id: "p", cronJobId: "j", description: "Car", totalAmount: total, monthlyAmount: monthly,
    totalMonths: months, startDate: start, endDate: addMonths(start, months - 1),
    createdAt: start, updatedAt: start,
    payments: Array.from({ length: paid }, (_, i) => ({
      id: `r${i + 1}`, paymentPlanId: "p", dueDate: addMonths(start, i), amount: monthly,
      isPaid: true, paidDate: null, paymentMonth: i + 1, notes: "", receiptNumber: null,
      createdAt: start, updatedAt: start,
    })),
  };
}
const mkJob = (id: string, plans: PaymentPlan[]) =>
  ({ id, name: id, paymentPlans: plans }) as unknown as JobDetail;

const car = mkPlan({ paid: 22 });
assert.deepEqual(nextInstallment(car), { paymentMonth: 23, dueDate: "2026-11-05T05:00:00.000Z", amount: 14828, existingRecordId: null });
assert.deepEqual(planTotals(car), { paidCount: 22, totalMonths: 48, paidSum: 326216, totalSum: 750000, remainingSum: 423784, monthsLeft: 26, pct: 46 });
assert.equal(nextInstallment(mkPlan({ paid: 48 })), null);
assert.deepEqual(nextInstallment(mkPlan({ paid: 0 })), { paymentMonth: 1, dueDate: "2025-01-05T05:00:00.000Z", amount: 14828, existingRecordId: null });
assert.equal(nextInstallment(mkPlan({ start: "2026-01-31T05:00:00Z", paid: 1 }))!.dueDate, "2026-02-28T05:00:00.000Z");
// Bangkok date, not UTC: 2026-01-30 23:00 BKK = 16:00Z, next month day 30 BKK
assert.equal(nextInstallment(mkPlan({ start: "2026-01-31T18:00:00Z", paid: 1 }))!.dueDate, "2026-02-28T18:00:00.000Z");

const withUnpaid = mkPlan({ paid: 22 });
withUnpaid.payments.push({ ...withUnpaid.payments[21], id: "u23", paymentMonth: 23, isPaid: false, dueDate: "2026-11-05T05:00:00Z", amount: "15000" });
assert.deepEqual(nextInstallment(withUnpaid), { paymentMonth: 23, dueDate: "2026-11-05T05:00:00.000Z", amount: 15000, existingRecordId: "u23" });

const a = mkJob("a", [mkPlan({ paid: 22 })]);
const b = mkJob("b", [mkPlan({ start: "2025-01-27T05:00:00Z", paid: 22 })]);
assert.equal(mostUrgent([b, a])!.job.id, "a");
assert.equal(mostUrgent([a, b])!.next.dueDate, "2026-11-05T05:00:00.000Z");
assert.equal(mostUrgent([mkJob("x", [])]), null);
assert.equal(mostUrgent([]), null);
console.log("plan ok");
