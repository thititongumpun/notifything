import Link from "next/link";
import { Plus } from "lucide-react";
import { JobsTable } from "@/components/dashboard/JobsTable";
import { PlanProgress } from "@/components/charts/PlanProgress";
import { BalanceChart } from "@/components/charts/BalanceChart";
import { getJobs, getJobDetail } from "@/lib/api";
import { btnPrimary, dangerCallout } from "@/components/ui/styles";
import { fmt } from "@/lib/format";
import type { Job, JobDetail } from "@/lib/types";

export default async function DashboardPage() {
  let jobs: Job[] = [];
  let error: string | null = null;

  try {
    jobs = await getJobs();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load jobs";
  }

  // Fetch details to find jobs with payment plans; failed fetches are skipped,
  // never crash the page.
  const details = await Promise.allSettled(
    jobs.map((j) => getJobDetail(j.id)),
  );
  const withPlans = details
    .filter(
      (r): r is PromiseFulfilledResult<JobDetail> => r.status === "fulfilled",
    )
    .map((r) => r.value)
    .filter((d) => d.paymentPlans.length > 0);

  const paidToDate = withPlans.reduce(
    (sum, d) =>
      sum +
      d.paymentPlans.reduce(
        (planSum, plan) =>
          planSum +
          plan.payments
            .filter((p) => p.isPaid)
            .reduce((s, p) => s + Number(p.amount), 0),
        0,
      ),
    0,
  );

  const activeCount = jobs.filter((j) => j.enabled).length;

  return (
    <div className="flex flex-col gap-[var(--space-md)]">
      <h1 className="sr-only">Dashboard</h1>

      {/* Stat strip: one hairline-divided container, not four cards */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-rule)] lg:grid-cols-4">
        <div className="min-w-0 bg-[var(--color-paper-2)] p-[var(--space-xs)]">
          <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)]">Total jobs</p>
          <p className="mt-[var(--space-3xs)] font-display text-[length:var(--text-lg)] font-semibold tracking-[-0.02em] text-[var(--color-ink)] tabular-nums">{jobs.length}</p>
        </div>
        <div className="min-w-0 bg-[var(--color-paper-2)] p-[var(--space-xs)]">
          <p className="flex items-center gap-[var(--space-3xs)] text-[length:var(--text-sm)] text-[var(--color-ink-2)]">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
            Active
          </p>
          <p className="mt-[var(--space-3xs)] font-display text-[length:var(--text-lg)] font-semibold tracking-[-0.02em] text-[var(--color-ink)] tabular-nums">{activeCount}</p>
        </div>
        <div className="min-w-0 bg-[var(--color-paper-2)] p-[var(--space-xs)]">
          <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)]">Disabled</p>
          <p className="mt-[var(--space-3xs)] font-display text-[length:var(--text-lg)] font-semibold tracking-[-0.02em] text-[var(--color-ink)] tabular-nums">{jobs.length - activeCount}</p>
        </div>
        <div className="min-w-0 bg-[var(--color-paper-2)] p-[var(--space-xs)]">
          <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)]">Paid to date</p>
          {/* ponytail: whitespace-nowrap keeps the number intact (it must never
              split mid-digit); text-sm→sm:text-lg keeps it inside the 114px
              mobile tile. Ceiling: comfortably fits up to ~8-digit baht totals
              (e.g. ฿99,999,999.99) at 320px. If paidToDate regularly exceeds
              ~99,999,999, step the base size down further or widen the tile
              (e.g. col-span-2) instead of re-adding overflow-wrap here. */}
          <p className="mt-[var(--space-3xs)] font-display text-[length:var(--text-sm)] sm:text-[length:var(--text-lg)] font-semibold tracking-[-0.02em] text-[var(--color-ink)] tabular-nums whitespace-nowrap">
            ฿{fmt(paidToDate)}
          </p>
        </div>
      </div>
        {/* Payment progress — real plans only */}
        {withPlans.length > 0 && (
          <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
            <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)]">
              <h2 className="font-display text-[length:var(--text-md)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                Payment progress
              </h2>
            </div>
            {withPlans.map((job) => (
              <div
                key={job.id}
                className="border-b border-[var(--color-rule)] last:border-b-0"
              >
                <Link
                  href={`/jobs/${job.id}`}
                  className="block px-[var(--space-xs)] py-[var(--space-2xs)] text-[length:var(--text-sm)] font-medium leading-[var(--leading-table)] text-[var(--color-ink)] transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] hover:text-[var(--color-accent)] [overflow-wrap:anywhere]"
                >
                  {job.name}
                </Link>
                {job.paymentPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex flex-col gap-[var(--space-2xs)] border-t border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)]"
                  >
                    <PlanProgress plan={plan} />
                    <BalanceChart plan={plan} />
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}

        {/* Jobs table */}
        <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] overflow-hidden">
          <div className="px-[var(--space-xs)] py-[var(--space-2xs)] border-b border-[var(--color-rule)] flex items-center justify-between gap-[var(--space-2xs)]">
            <h2 className="font-display text-[length:var(--text-md)] font-semibold tracking-[-0.02em] text-[var(--color-ink)] min-w-0 [overflow-wrap:anywhere]">
              Scheduled jobs
            </h2>
            <Link
              href="/jobs/new"
              className={btnPrimary}
            >
              <Plus className="w-3.5 h-3.5" />
              Add job
            </Link>
          </div>
          {error ? (
            <div className="p-[var(--space-xs)]">
              <p role="alert" className={dangerCallout}>
                Couldn&apos;t load jobs: {error}
              </p>
            </div>
          ) : (
            <JobsTable jobs={jobs} />
          )}
        </div>
      </div>
  );
}
