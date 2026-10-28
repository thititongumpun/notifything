import Link from "next/link";
import { Plus } from "lucide-react";
import { JobsTable, type JobRow } from "@/components/dashboard/JobsTable";
import { NextDueHero } from "@/components/dashboard/NextDueHero";
import { MonthCalendar, type MonthDays } from "@/components/dashboard/MonthCalendar";
import { getJobs, getJobDetail } from "@/lib/api";
import { btnPrimary, card, dangerCallout } from "@/components/ui/styles";
import { bkkParts, fmt } from "@/lib/format";
import { nextRun, runDaysInMonth } from "@/lib/cron";
import { mostUrgent, planTotals } from "@/lib/plan";
import type { Job, JobDetail } from "@/lib/types";

export const dynamic = "force-dynamic"; // `now` must be per-request

export default async function DashboardPage() {
  let jobs: Job[] = [];
  let error: string | null = null;

  try {
    jobs = await getJobs();
  } catch (e) {
    error = e instanceof Error ? e.message : "โหลดรายการงานไม่สำเร็จ";
  }

  // Failed detail fetches are skipped, never crash the page.
  const settled = await Promise.allSettled(jobs.map((j) => getJobDetail(j.id)));
  const details = settled
    .filter((r): r is PromiseFulfilledResult<JobDetail> => r.status === "fulfilled")
    .map((r) => r.value);

  const now = new Date();
  const urgent = mostUrgent(details);

  const rows: JobRow[] = jobs
    .map((job) => ({ job, next: job.enabled ? nextRun(job.cron, now) : null }))
    .sort((a, b) => {
      if (a.job.enabled !== b.job.enabled) return a.job.enabled ? -1 : 1;
      if (!a.next || !b.next) return a.next ? -1 : b.next ? 1 : 0;
      return a.next.getTime() - b.next.getTime();
    });
  const first = rows.find((r) => r.job.enabled && r.next);
  const fallback = first && first.next ? { job: first.job, at: first.next } : null;

  // Month grid
  const today = bkkParts(now);
  const days: MonthDays = {};
  const shown = new Set<string>();
  let skipped = 0;
  for (const j of jobs.filter((j) => j.enabled)) {
    const ds = runDaysInMonth(j.cron, today.year, today.month);
    if (!ds) { skipped++; continue; }
    if (ds.length) shown.add(j.id);
    for (const d of ds) (days[d] ??= []).push(j.name);
  }
  const heroDue = urgent ? new Date(urgent.next.dueDate) : (fallback?.at ?? null);
  const dueP = heroDue ? bkkParts(heroDue) : null;
  const dueDay = dueP && dueP.year === today.year && dueP.month === today.month ? dueP.day : null;

  // Money across all plans
  const totals = details.flatMap((d) => d.paymentPlans).map(planTotals);
  const paid = totals.reduce((s, t) => s + t.paidSum, 0);
  const left = totals.reduce((s, t) => s + t.remainingSum, 0);
  const activeCount = jobs.filter((j) => j.enabled).length;

  const stat = (label: string, value: string) => (
    <div className="flex min-w-0 items-baseline justify-between gap-[var(--space-2xs)] bg-[var(--color-paper-2)] p-[var(--space-xs)] sm:block">
      <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)]">{label}</p>
      <p className="font-mono text-[length:var(--text-md)] font-semibold tabular-nums whitespace-nowrap text-[var(--color-ink)] sm:mt-[var(--space-3xs)]">{value}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-[var(--space-md)]">
      <h1 className="sr-only">ภาพรวม</h1>

      {error ? (
        <p role="alert" className={dangerCallout}>โหลดข้อมูลไม่สำเร็จ: {error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-[var(--space-md)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <NextDueHero urgent={urgent} fallback={fallback} now={now} />
            <MonthCalendar
              year={today.year} month={today.month} days={days}
              jobCount={shown.size} skipped={skipped}
              todayDay={today.day} dueDay={dueDay}
            />
          </div>

          <div className="grid grid-cols-1 gap-px sm:grid-cols-3 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-rule)]">
            {stat("งานที่เปิดอยู่", `${activeCount}/${jobs.length}`)}
            {stat("ชำระแล้ว", `฿${fmt(paid)}`)}
            {stat("คงเหลือรวม", `฿${fmt(left)}`)}
          </div>
        </>
      )}

      <section className={`${card} overflow-hidden`}>
        <div className="flex items-center justify-between gap-[var(--space-2xs)] border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)]">
          <h2 className="min-w-0 font-display text-[length:var(--text-md)] font-semibold text-[var(--color-ink)]">งานทั้งหมด</h2>
          <Link href="/jobs/new" className={btnPrimary}>
            <Plus className="size-4" />
            เพิ่มงาน
          </Link>
        </div>
        {!error && <JobsTable rows={rows} />}
      </section>
    </div>
  );
}
