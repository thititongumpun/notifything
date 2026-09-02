/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Job } from "@/lib/types";
import { formatDate } from "@/lib/format";

function StatusChip({ enabled }: { enabled: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-rule)] px-2 py-1 text-[length:var(--text-xs)] font-medium leading-none text-[var(--color-ink-2)]">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          enabled ? "bg-[var(--color-accent)]" : "bg-[var(--color-rule)]"
        }`}
        aria-hidden
      />
      {enabled ? "Enabled" : "Disabled"}
    </span>
  );
}

export function JobsTable({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-[var(--space-2xs)] px-[var(--space-xs)] py-[var(--space-md)] text-center">
        <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)]">
          No jobs found.
        </p>
        <Link
          href="/jobs/new"
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 text-[length:var(--text-sm)] font-medium bg-[var(--color-accent)] text-[var(--color-accent-ink)] px-3 py-2 rounded-[10px] transition-[transform,background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:brightness-110 hover:-translate-y-[1px] active:translate-y-[1px]"
        >
          <Plus className="w-3.5 h-3.5" />
          Add job
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table (>=768px) */}
      <div className="hidden md:block">
        <table className="w-full text-[length:var(--text-sm)] leading-[var(--leading-table)]">
          <thead>
            <tr className="border-b border-[var(--color-rule)]">
              {["Name", "Cron", "Status", "Last Run", "Created"].map((h) => (
                <th
                  key={h}
                  className="px-[var(--space-xs)] py-[var(--space-2xs)] text-left text-[length:var(--text-xs)] font-medium uppercase tracking-wide text-[var(--color-ink-2)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="border-b border-[var(--color-rule)] last:border-b-0 transition-[background-color,transform] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-3)]"
              >
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] font-medium min-w-0 max-w-[16rem] truncate">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-[var(--color-ink)] transition-colors duration-[var(--dur-short)] hover:text-[var(--color-accent)]"
                  >
                    {job.name}
                  </Link>
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)]">
                  <code className="font-mono tabular-nums text-[length:var(--text-sm)] text-[var(--color-ink-2)]">
                    {job.cron.trim()}
                  </code>
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)]">
                  <StatusChip enabled={job.enabled} />
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] font-mono tabular-nums text-[var(--color-ink-2)]">
                  {formatDate(job.lastRunAt)}
                </td>
                <td className="px-[var(--space-xs)] py-[var(--space-2xs)] font-mono tabular-nums text-[var(--color-ink-2)]">
                  {formatDate(job.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards (<768px) */}
      <div className="md:hidden flex flex-col">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="block min-h-[44px] px-[var(--space-xs)] py-[var(--space-2xs)] border-b border-[var(--color-rule)] last:border-b-0 transition-[background-color,transform] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-3)] active:translate-y-[1px]"
          >
            <div className="flex items-start justify-between gap-[var(--space-2xs)] min-w-0">
              <p className="font-medium leading-[var(--leading-table)] text-[var(--color-ink)] min-w-0 [overflow-wrap:anywhere]">
                {job.name}
              </p>
              <StatusChip enabled={job.enabled} />
            </div>
            <dl className="mt-[var(--space-3xs)] flex flex-col gap-[var(--space-3xs)] text-[length:var(--text-sm)] leading-[var(--leading-table)]">
              <div className="flex gap-[var(--space-3xs)] min-w-0">
                <dt className="text-[length:var(--text-xs)] uppercase tracking-wide text-[var(--color-ink-2)] shrink-0 pt-px">
                  Cron
                </dt>
                <dd className="font-mono tabular-nums text-[length:var(--text-sm)] leading-[var(--leading-table)] text-[var(--color-ink-2)] min-w-0 [overflow-wrap:anywhere]">
                  {job.cron.trim()}
                </dd>
              </div>
              <div className="flex gap-[var(--space-3xs)] min-w-0">
                <dt className="text-[length:var(--text-xs)] uppercase tracking-wide text-[var(--color-ink-2)] shrink-0 pt-px">
                  Last run
                </dt>
                <dd className="font-mono tabular-nums text-[length:var(--text-sm)] leading-[var(--leading-table)] text-[var(--color-ink-2)]">
                  {formatDate(job.lastRunAt)}
                </dd>
              </div>
              <div className="flex gap-[var(--space-3xs)] min-w-0">
                <dt className="text-[length:var(--text-xs)] uppercase tracking-wide text-[var(--color-ink-2)] shrink-0 pt-px">
                  Created
                </dt>
                <dd className="font-mono tabular-nums text-[length:var(--text-sm)] leading-[var(--leading-table)] text-[var(--color-ink-2)]">
                  {formatDate(job.createdAt)}
                </dd>
              </div>
            </dl>
          </Link>
        ))}
      </div>
    </>
  );
}
