import Link from "next/link";
import { notFound } from "next/navigation";
import type { JobDetail } from "@/lib/types";
import { PlanCard } from "@/components/payments/PlanCard";
import { fmtThaiDateTime } from "@/lib/format";
import { nextRun } from "@/lib/cron";
import { DateLeaf } from "@/components/calendar/DateLeaf";
import { JobEditor } from "@/components/jobs/JobEditor";
import { ArrowLeft } from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";
import { backLink } from "@/components/ui/styles";

async function getJob(id: string): Promise<JobDetail> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
    next: { revalidate: 60, tags: ["jobs"] },
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`โหลดข้อมูลงานไม่สำเร็จ (HTTP ${res.status})`);
  // The API returns 200 with an empty body for unknown ids.
  const job = await res.json().catch(() => null);
  if (!job || job.id !== id) notFound();
  return job;
}

const labelClass =
  "text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)]";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await getJob(id);

  let pushEndpoint: string | null = null;
  try {
    const parsed = JSON.parse(job.subscriptions?.subscription ?? "{}");
    pushEndpoint = parsed.endpoint ?? null;
  } catch {
    // ignore malformed JSON
  }

  const dd = "mt-[var(--space-3xs)] font-mono text-[length:var(--text-sm)] leading-[var(--leading-body)] tabular-nums text-[var(--color-ink)]";
  const dl = "grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-x-[var(--space-xs)] gap-y-[var(--space-2xs)]";
  const h2 = "font-display text-[length:var(--text-md)] font-semibold leading-[var(--leading-tight)] tracking-[-0.02em] text-[var(--color-ink)]";
  const sub = job.subscriptions;

  return (
    <div className="flex flex-col gap-[var(--space-sm)] max-w-3xl mx-auto w-full">
      <Link href="/dashboard" className={backLink}>
        <ArrowLeft className="w-4 h-4" aria-hidden />
        กลับ
      </Link>

      <header className="flex items-start gap-[var(--space-xs)] pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
        <DateLeaf date={job.enabled ? nextRun(job.cron, new Date()) : null} size="lg" />
        <JobEditor job={job} />
      </header>

      <dl className={`${dl} pb-[var(--space-sm)] border-b border-[var(--color-rule)]`}>
        <div className="min-w-0">
          <dt className={labelClass}>รหัสงาน</dt>
          <dd className="mt-[var(--space-3xs)] min-w-0 font-mono text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)] [overflow-wrap:anywhere]">{job.id}</dd>
        </div>
        <div className="min-w-0">
          <dt className={labelClass}>ทำงานล่าสุด</dt>
          <dd className={dd}>{fmtThaiDateTime(job.lastRunAt)}</dd>
        </div>
        <div className="min-w-0">
          <dt className={labelClass}>สร้างเมื่อ</dt>
          <dd className={dd}>{fmtThaiDateTime(job.createdAt)}</dd>
        </div>
      </dl>

      <section className="pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
        <h2 className={h2}>การแจ้งเตือน</h2>
        {sub ? (
          <dl className={`mt-[var(--space-2xs)] ${dl}`}>
            <div className="min-w-0">
              <dt className={labelClass}>สถานะ</dt>
              <dd className="mt-[var(--space-3xs)]">
                <StatusChip on={sub.isActive} label={sub.isActive ? "เปิด" : "ปิด"} />
              </dd>
            </div>
            <div className="min-w-0">
              <dt className={labelClass}>รหัส</dt>
              <dd className="mt-[var(--space-3xs)] min-w-0 font-mono text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)] [overflow-wrap:anywhere]">{sub.id}</dd>
            </div>
            <div className="min-w-0">
              <dt className={labelClass}>วันที่สมัคร</dt>
              <dd className={dd}>{fmtThaiDateTime(sub.createdAt)}</dd>
            </div>
            <div className="min-w-0">
              <dt className={labelClass}>อัปเดตล่าสุด</dt>
              <dd className={dd}>{fmtThaiDateTime(sub.updatedAt)}</dd>
            </div>
            {pushEndpoint && (
              <div className="col-span-full min-w-0">
                <dt className={labelClass}>ปลายทางแจ้งเตือน (endpoint)</dt>
                <dd className="mt-[var(--space-3xs)] min-w-0 font-mono text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)] [overflow-wrap:anywhere]">{pushEndpoint}</dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="mt-[var(--space-2xs)] text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)]">ยังไม่มีการสมัครรับการแจ้งเตือน</p>
        )}
      </section>

      <section className="flex flex-col gap-[var(--space-2xs)]">
        <h2 className={h2}>
          แผนการชำระ
          {job.paymentPlans.length > 0 && (
            <span className="ml-2 font-body text-[length:var(--text-sm)] font-normal tracking-normal text-[var(--color-ink-2)]">({job.paymentPlans.length})</span>
          )}
        </h2>
        {job.paymentPlans.length > 0 ? (
          job.paymentPlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
        ) : (
          <p className="text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)] py-[var(--space-2xs)]">ยังไม่มีแผนการชำระ</p>
        )}
      </section>
    </div>
  );
}
