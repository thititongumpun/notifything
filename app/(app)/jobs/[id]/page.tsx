import Link from "next/link";
import { notFound } from "next/navigation";
import type { JobDetail } from "@/lib/types";
import { PlanCard } from "@/components/payments/PlanCard";
import { formatDate } from "@/lib/format";
import { ArrowLeft } from "lucide-react";

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

function StatusPill({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-pill)] border px-2 py-1 text-[length:var(--text-xs)] font-medium leading-none ${
        on
          ? "border-[var(--color-accent)] text-[var(--color-accent)]"
          : "border-[var(--color-rule)] text-[var(--color-ink-2)]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${on ? "bg-[var(--color-accent)]" : "bg-[var(--color-rule)]"}`}
        aria-hidden
      />
      {label}
    </span>
  );
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
        <Link
          href="/dashboard"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)] transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] hover:text-[var(--color-ink)] active:translate-y-[1px]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden />
          Back to Dashboard
        </Link>

        {/* Job header */}
        <header className="flex flex-col gap-[var(--space-2xs)] pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-2xs)] min-w-0">
            <h1 className="min-w-0 font-display text-[length:var(--text-lg)] font-semibold leading-[var(--leading-tight)] tracking-[-0.02em] text-[var(--color-ink)] [overflow-wrap:anywhere]">
              {job.name}
            </h1>
            <StatusPill on={job.enabled} label={job.enabled ? "Enabled" : "Disabled"} />
          </div>
        </header>

        {/* Job facts */}
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-x-[var(--space-xs)] gap-y-[var(--space-2xs)] pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
          <div className="min-w-0">
            <p className={labelClass}>Cron Expression</p>
            <code className="mt-[var(--space-3xs)] block min-w-0 font-mono text-[length:var(--text-sm)] leading-[var(--leading-body)] tabular-nums text-[var(--color-ink)] [overflow-wrap:anywhere]">
              {job.cron.trim()}
            </code>
          </div>
          <div className="min-w-0">
            <p className={labelClass}>Job ID</p>
            <code className="mt-[var(--space-3xs)] block min-w-0 font-mono text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)] [overflow-wrap:anywhere]">
              {job.id}
            </code>
          </div>
          <div className="min-w-0">
            <p className={labelClass}>Last Run</p>
            <p className="mt-[var(--space-3xs)] font-mono text-[length:var(--text-sm)] leading-[var(--leading-body)] tabular-nums text-[var(--color-ink)]">
              {formatDate(job.lastRunAt)}
            </p>
          </div>
          <div className="min-w-0">
            <p className={labelClass}>Created</p>
            <p className="mt-[var(--space-3xs)] font-mono text-[length:var(--text-sm)] leading-[var(--leading-body)] tabular-nums text-[var(--color-ink)]">
              {formatDate(job.createdAt)}
            </p>
          </div>
        </section>

        {/* Subscription */}
        <section className="pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
          <h2 className="font-display text-[length:var(--text-md)] font-semibold leading-[var(--leading-tight)] tracking-[-0.02em] text-[var(--color-ink)]">
            Push Subscription
          </h2>
          {job.subscriptions ? (
            <div className="mt-[var(--space-2xs)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-x-[var(--space-xs)] gap-y-[var(--space-2xs)]">
              <div className="min-w-0">
                <p className={labelClass}>Status</p>
                <div className="mt-[var(--space-3xs)]">
                  <StatusPill
                    on={job.subscriptions.isActive}
                    label={job.subscriptions.isActive ? "Active" : "Inactive"}
                  />
                </div>
              </div>
              <div className="min-w-0">
                <p className={labelClass}>Subscription ID</p>
                <code className="mt-[var(--space-3xs)] block min-w-0 font-mono text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)] [overflow-wrap:anywhere]">
                  {job.subscriptions.id}
                </code>
              </div>
              <div className="min-w-0">
                <p className={labelClass}>Subscribed At</p>
                <p className="mt-[var(--space-3xs)] font-mono text-[length:var(--text-sm)] leading-[var(--leading-body)] tabular-nums text-[var(--color-ink)]">
                  {formatDate(job.subscriptions.createdAt)}
                </p>
              </div>
              <div className="min-w-0">
                <p className={labelClass}>Updated At</p>
                <p className="mt-[var(--space-3xs)] font-mono text-[length:var(--text-sm)] leading-[var(--leading-body)] tabular-nums text-[var(--color-ink)]">
                  {formatDate(job.subscriptions.updatedAt)}
                </p>
              </div>
              {pushEndpoint && (
                <div className="col-span-full min-w-0">
                  <p className={labelClass}>Push Endpoint</p>
                  <p className="mt-[var(--space-3xs)] font-mono text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)] min-w-0 [overflow-wrap:anywhere]">
                    {pushEndpoint}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-[var(--space-2xs)] text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)]">
              No subscription registered.
            </p>
          )}
        </section>

        {/* Payment Plans — creation lives on /payments card footers, so no action callbacks here */}
        <section className="flex flex-col gap-[var(--space-2xs)]">
          <h2 className="font-display text-[length:var(--text-md)] font-semibold leading-[var(--leading-tight)] tracking-[-0.02em] text-[var(--color-ink)]">
            Payment Plans
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
