import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { JobsTable } from "@/components/dashboard/JobsTable";
import type { Job } from "@/lib/types";

async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
  return res.json();
}

export default async function DashboardPage() {
  let jobs: Job[] = [];
  let error: string | null = null;

  try {
    jobs = await getJobs();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load jobs";
  }

  const activeCount = jobs.filter((j) => j.enabled).length;

  return (
    <AppShell>
      <div className="flex flex-col gap-[var(--space-md)]">
        {/* Stat strip */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-[var(--space-2xs)] sm:grid-cols-3">
          <div
            className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-xs)]"
          >
            <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] uppercase tracking-wide">
              Total Jobs
            </p>
            <p className="mt-[var(--space-3xs)] font-display text-[length:var(--text-xl)] font-semibold tracking-[-0.02em] text-[var(--color-ink)] tabular-nums">
              {jobs.length}
            </p>
          </div>
          <div
            className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-xs)]"
          >
            <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] uppercase tracking-wide">
              Active
            </p>
            <p className="mt-[var(--space-3xs)] font-display text-[length:var(--text-xl)] font-semibold tracking-[-0.02em] text-[var(--color-accent)] tabular-nums">
              {activeCount}
            </p>
          </div>
          <div
            className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-xs)] col-span-1 sm:col-span-1"
          >
            <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] uppercase tracking-wide">
              Disabled
            </p>
            <p className="mt-[var(--space-3xs)] font-display text-[length:var(--text-xl)] font-semibold tracking-[-0.02em] text-[var(--color-ink)] tabular-nums">
              {jobs.length - activeCount}
            </p>
          </div>
        </div>

        {/* Jobs table */}
        <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] overflow-hidden">
          <div className="px-[var(--space-xs)] py-[var(--space-2xs)] border-b border-[var(--color-rule)] flex items-center justify-between gap-[var(--space-2xs)]">
            <h2 className="font-display text-[length:var(--text-md)] font-semibold tracking-[-0.02em] text-[var(--color-ink)] min-w-0 [overflow-wrap:anywhere]">
              Scheduled Jobs
            </h2>
            <Link
              href="/jobs/new"
              className="inline-flex min-h-[44px] md:min-h-0 items-center justify-center gap-1.5 text-[length:var(--text-sm)] font-medium bg-[var(--color-accent)] text-[var(--color-accent-ink)] px-3 py-2 rounded-[10px] transition-[transform,background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-accent)] hover:brightness-110 hover:-translate-y-[1px] active:translate-y-[1px]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Job
            </Link>
          </div>
          {error ? (
            <div className="px-[var(--space-xs)] py-[var(--space-md)] text-center text-[length:var(--text-sm)] text-[var(--color-danger)]">
              {error}
            </div>
          ) : (
            <JobsTable jobs={jobs} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
