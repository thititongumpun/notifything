import Link from "next/link";
import { Plus } from "lucide-react";
import type { Job } from "@/lib/types";
import { fmtThaiDateTime } from "@/lib/format";
import { DateLeaf } from "@/components/calendar/DateLeaf";
import { StatusChip } from "@/components/ui/StatusChip";
import { CronSchedule } from "@/components/ui/CronSchedule";
import { btnPrimary } from "@/components/ui/styles";

export type JobRow = { job: Job; next: Date | null };

export function JobsTable({ rows }: { rows: JobRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-[var(--space-2xs)] px-[var(--space-xs)] py-[var(--space-md)] text-center">
        <p className="font-medium text-[var(--color-ink)]">ยังไม่มีงาน</p>
        <Link href="/jobs/new" className={btnPrimary}>
          <Plus className="size-4" />
          เพิ่มงาน
        </Link>
      </div>
    );
  }

  return (
    <ul>
      {rows.map(({ job, next }) => (
        <li key={job.id} className="flex items-center gap-[var(--space-xs)] border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] last:border-b-0">
          <DateLeaf date={next} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-[var(--space-2xs)]">
              <Link href={`/jobs/${job.id}`} className="inline-flex min-h-[44px] min-w-0 items-center font-medium text-[var(--color-ink)] [overflow-wrap:anywhere] hover:underline">
                {job.name}
              </Link>
              {!job.enabled ? <StatusChip on={false} label="ปิดอยู่" /> : null}
            </div>
            <CronSchedule cron={job.cron} />
          </div>
          <span className="hidden shrink-0 font-mono text-[length:var(--text-sm)] tabular-nums text-[var(--color-ink-2)] md:block">
            {fmtThaiDateTime(next)}
          </span>
        </li>
      ))}
    </ul>
  );
}
