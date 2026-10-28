import Link from "next/link";
import { DateLeaf } from "@/components/calendar/DateLeaf";
import { CronSchedule } from "@/components/ui/CronSchedule";
import { RecordPaymentButton } from "@/components/dashboard/RecordPaymentButton";
import { card } from "@/components/ui/styles";
import { daysUntil, fmt, fmtThaiMonthYear, relativeDayLabel } from "@/lib/format";
import { planTotals, type Urgent } from "@/lib/plan";
import type { Job } from "@/lib/types";

const eyebrowCls = "text-[length:var(--text-sm)] font-medium";

export function NextDueHero({ urgent, fallback, now }: { urgent: Urgent | null; fallback: { job: Job; at: Date } | null; now: Date }) {
  if (urgent) {
    const { job, plan, next } = urgent;
    const due = new Date(next.dueDate);
    const days = daysUntil(due, now);
    const t = planTotals(plan);
    return (
      <section aria-label="ครบกำหนดถัดไป" className="min-w-0 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] p-[var(--space-sm)]">
        <p className={eyebrowCls} style={{ color: days < 0 ? "var(--color-danger)" : "var(--color-ink-2)" }}>
          ครบกำหนดถัดไป · {relativeDayLabel(days)}
        </p>
        <div className="mt-[var(--space-xs)] flex flex-wrap items-start gap-[var(--space-sm)]">
          <DateLeaf date={due} size="lg" />
          <div className="min-w-0 flex-1 basis-48">
            <Link href={`/jobs/${job.id}`} className="block font-display text-[length:var(--text-lg)] font-semibold leading-tight text-[var(--color-ink)] [overflow-wrap:anywhere] hover:underline">
              {job.name}
            </Link>
            <p className="mt-[var(--space-3xs)] text-[length:var(--text-sm)] text-[var(--color-ink-2)] [overflow-wrap:anywhere]">
              งวดที่ {next.paymentMonth} / {t.totalMonths}
            </p>
            <p className="mt-[var(--space-2xs)] font-mono text-[length:var(--text-xl)] font-semibold tabular-nums text-[var(--color-ink)]">
              ฿{fmt(next.amount)}
            </p>
          </div>
        </div>
        <div className="mt-[var(--space-sm)]">
          <div
            role="progressbar"
            aria-label="ชำระแล้ว"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={t.pct}
            className="h-2.5 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-track)]"
          >
            <div className="h-full bg-[var(--color-ink)]" style={{ width: `${t.pct}%` }} />
          </div>
          <p className="mt-[var(--space-2xs)] text-[length:var(--text-sm)] text-[var(--color-ink-2)] [overflow-wrap:anywhere]">
            ชำระแล้ว {t.paidCount}/{t.totalMonths} งวด · คงเหลือ <span className="font-mono tabular-nums">฿{fmt(t.remainingSum)}</span> · จบ {fmtThaiMonthYear(plan.endDate)}
          </p>
        </div>
        <div className="mt-[var(--space-sm)]">
          <RecordPaymentButton plan={plan} next={next} />
        </div>
      </section>
    );
  }

  if (fallback) {
    const { job, at } = fallback;
    const days = daysUntil(at, now);
    return (
      <section aria-label="ครบกำหนดถัดไป" className="min-w-0 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] p-[var(--space-sm)]">
        <p className={`${eyebrowCls} text-[var(--color-ink-2)]`}>งานรอบถัดไป · {relativeDayLabel(days)}</p>
        <div className="mt-[var(--space-xs)] flex flex-wrap items-start gap-[var(--space-sm)]">
          <DateLeaf date={at} size="lg" />
          <div className="min-w-0 flex-1 basis-48">
            <p className="font-display text-[length:var(--text-lg)] font-semibold leading-tight text-[var(--color-ink)] [overflow-wrap:anywhere]">{job.name}</p>
            <div className="mt-[var(--space-2xs)]"><CronSchedule cron={job.cron} /></div>
            <Link href={`/jobs/${job.id}`} className="mt-[var(--space-2xs)] inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-medium text-[var(--color-ink)] underline">
              ดูงาน
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="ครบกำหนดถัดไป" className={`${card} p-[var(--space-sm)]`}>
      <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)]">ยังไม่มีกำหนดถัดไป</p>
    </section>
  );
}
