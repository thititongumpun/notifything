import Link from "next/link";
import { notFound } from "next/navigation";
import type { JobDetail } from "@/lib/types";
import { PlanCard } from "@/components/payments/PlanCard";
import { formatDate } from "@/lib/format";
import { ArrowLeft } from "lucide-react";
import { CronSchedule } from "@/components/ui/CronSchedule";
import { StatusChip } from "@/components/ui/StatusChip";
import { backLink } from "@/components/ui/styles";

async function getJob(id: string): Promise<JobDetail> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
    next: { revalidate: 60, tags: ["jobs"] },
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Failed to fetch job: ${res.status}`);
  // The API returns 200 with an empty body for unknown ids.
  const job = await res.json().catch(() => null);
  if (!job || job.id !== id) notFound();
  return job;
}

const labelClass =
  "text-[length:var(--text-xs)] uppercase tracking-wide leading-[var(--leading-body)] text-[var(--color-ink-2)]";

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

  return (
    <div className="flex flex-col gap-[var(--space-sm)] max-w-3xl mx-auto w-full">
        {/* Back */}
        <Link href="/dashboard" className={backLink}>
          <ArrowLeft className="w-4 h-4" aria-hidden />
          Back to dashboard
        </Link>

        {/* Job header */}
        <header className="flex flex-col gap-[var(--space-2xs)] pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-2xs)] min-w-0">
            <h1 className="min-w-0 font-display text-[length:var(--text-lg)] font-semibold leading-[var(--leading-tight)] tracking-[-0.02em] text-[var(--color-ink)] [overflow-wrap:anywhere]">
              {job.name}
            </h1>
            <StatusChip on={job.enabled} label={job.enabled ? "Enabled" : "Disabled"} />
          </div>
        </header>

        {/* Job facts */}
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-x-[var(--space-xs)] gap-y-[var(--space-2xs)] pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
          <div className="min-w-0">
            <dt className={labelClass}>Cron expression</dt>
            <dd className="mt-[var(--space-3xs)] min-w-0"><CronSchedule cron={job.cron} /></dd>
          </div>
          <div className="min-w-0">
            <dt className={labelClass}>Job ID</dt>
            <dd className="mt-[var(--space-3xs)] min-w-0 font-mono text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)] [overflow-wrap:anywhere]">
              {job.id}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className={labelClass}>Last run</dt>
            <dd className="mt-[var(--space-3xs)] font-mono text-[length:var(--text-sm)] leading-[var(--leading-body)] tabular-nums text-[var(--color-ink)]">
              {formatDate(job.lastRunAt)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className={labelClass}>Created</dt>
            <dd className="mt-[var(--space-3xs)] font-mono text-[length:var(--text-sm)] leading-[var(--leading-body)] tabular-nums text-[var(--color-ink)]">
              {formatDate(job.createdAt)}
            </dd>
          </div>
        </dl>

        {/* Subscription */}
        <section className="pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
          <h2 className="font-display text-[length:var(--text-md)] font-semibold leading-[var(--leading-tight)] tracking-[-0.02em] text-[var(--color-ink)]">
            Push subscription
          </h2>
          {job.subscriptions ? (
            <dl className="mt-[var(--space-2xs)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-x-[var(--space-xs)] gap-y-[var(--space-2xs)]">
              <div className="min-w-0">
                <dt className={labelClass}>Status</dt>
                <dd className="mt-[var(--space-3xs)]">
                  <StatusChip
                    on={job.subscriptions.isActive}
                    label={job.subscriptions.isActive ? "Active" : "Inactive"}
                  />
                </dd>
              </div>
              <div className="min-w-0">
                <dt className={labelClass}>Subscription ID</dt>
                <dd className="mt-[var(--space-3xs)] min-w-0 font-mono text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)] [overflow-wrap:anywhere]">
                  {job.subscriptions.id}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className={labelClass}>Subscribed at</dt>
                <dd className="mt-[var(--space-3xs)] font-mono text-[length:var(--text-sm)] leading-[var(--leading-body)] tabular-nums text-[var(--color-ink)]">
                  {formatDate(job.subscriptions.createdAt)}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className={labelClass}>Updated at</dt>
                <dd className="mt-[var(--space-3xs)] font-mono text-[length:var(--text-sm)] leading-[var(--leading-body)] tabular-nums text-[var(--color-ink)]">
                  {formatDate(job.subscriptions.updatedAt)}
                </dd>
              </div>
              {pushEndpoint && (
                <div className="col-span-full min-w-0">
                  <dt className={labelClass}>Push endpoint</dt>
                  <dd className="mt-[var(--space-3xs)] font-mono text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)] min-w-0 [overflow-wrap:anywhere]">
                    {pushEndpoint}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="mt-[var(--space-2xs)] text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)]">
              No subscription registered.
            </p>
          )}
        </section>

        {/* Payment Plans — creation lives on /payments card footers, so no action callbacks here */}
        <section className="flex flex-col gap-[var(--space-2xs)]">
          <h2 className="font-display text-[length:var(--text-md)] font-semibold leading-[var(--leading-tight)] tracking-[-0.02em] text-[var(--color-ink)]">
            Payment plans
            {job.paymentPlans.length > 0 && (
              <span className="ml-2 font-body text-[length:var(--text-sm)] font-normal tracking-normal text-[var(--color-ink-2)]">
                ({job.paymentPlans.length})
              </span>
            )}
          </h2>
          {job.paymentPlans.length > 0 ? (
            job.paymentPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))
          ) : (
            <p className="text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)] py-[var(--space-2xs)]">
              No payment plans attached.
            </p>
          )}
        </section>
      </div>
  );
}
