import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import type { JobDetail } from "@/lib/types";
import { PaymentPlanCard } from "@/components/jobs/PaymentPlanCard";
import { ArrowLeft } from "lucide-react";

async function getJob(id: string): Promise<JobDetail> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Failed to fetch job: ${res.status}`);
  return res.json();
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
    <AppShell>
      <div className="flex flex-col gap-[var(--space-sm)] max-w-3xl mx-auto w-full">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-[length:var(--text-sm)] text-[var(--color-ink-2)] transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] hover:text-[var(--color-ink)] active:translate-y-[1px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Job header */}
        <header className="flex flex-col gap-[var(--space-2xs)] pb-[var(--space-2xs)] border-b border-[var(--color-rule)]">
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-2xs)] min-w-0">
            <h1 className="font-display text-[length:var(--text-lg)] font-semibold tracking-[-0.02em] text-[var(--color-ink)] min-w-0 [overflow-wrap:anywhere]">
              {job.name}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border px-2.5 py-1 text-[length:var(--text-xs)] font-medium leading-none ${
                job.enabled
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-[var(--color-rule)] text-[var(--color-ink-2)]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  job.enabled ? "bg-[var(--color-accent)]" : "bg-[var(--color-rule)]"
                }`}
              />
              {job.enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          {/* Meta in mono */}
          <div className="flex flex-col gap-[var(--space-3xs)] font-mono text-[length:var(--text-sm)] text-[var(--color-ink-2)] min-w-0">
            <p className="[overflow-wrap:anywhere]">{job.cron.trim()}</p>
            <p className="text-[length:var(--text-xs)] [overflow-wrap:anywhere]">{job.id}</p>
          </div>
        </header>

        {/* Job facts */}
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-[var(--space-xs)] pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
          <div>
            <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] mb-[var(--space-3xs)]">Cron Expression</p>
            <code className="font-mono text-[length:var(--text-sm)] text-[var(--color-ink)] min-w-0 [overflow-wrap:anywhere] break-all">
              {job.cron.trim()}
            </code>
          </div>
          <div>
            <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] mb-[var(--space-3xs)]">Job ID</p>
            <code className="font-mono text-[length:var(--text-xs)] text-[var(--color-ink-2)] break-all">{job.id}</code>
          </div>
          <div>
            <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] mb-[var(--space-3xs)]">Last Run</p>
            <p className="font-mono text-[length:var(--text-sm)] text-[var(--color-ink)]">{formatDate(job.lastRunAt)}</p>
          </div>
          <div>
            <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] mb-[var(--space-3xs)]">Created</p>
            <p className="font-mono text-[length:var(--text-sm)] text-[var(--color-ink)]">{formatDate(job.createdAt)}</p>
          </div>
        </section>

        {/* Subscription */}
        <section className="pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
          <h2 className="font-display text-[length:var(--text-md)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
            Push Subscription
          </h2>
          {job.subscriptions ? (
            <div className="mt-[var(--space-2xs)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-[var(--space-xs)]">
              <div>
                <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] mb-[var(--space-3xs)]">Status</p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border px-2 py-1 text-[length:var(--text-xs)] font-medium leading-none ${
                    job.subscriptions.isActive
                      ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                      : "border-[var(--color-rule)] text-[var(--color-ink-2)]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      job.subscriptions.isActive ? "bg-[var(--color-accent)]" : "bg-[var(--color-rule)]"
                    }`}
                  />
                  {job.subscriptions.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] mb-[var(--space-3xs)]">Subscription ID</p>
                <code className="font-mono text-[length:var(--text-xs)] text-[var(--color-ink-2)] break-all">
                  {job.subscriptions.id}
                </code>
              </div>
              <div>
                <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] mb-[var(--space-3xs)]">Subscribed At</p>
                <p className="font-mono text-[length:var(--text-sm)] text-[var(--color-ink)]">{formatDate(job.subscriptions.createdAt)}</p>
              </div>
              <div>
                <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] mb-[var(--space-3xs)]">Updated At</p>
                <p className="font-mono text-[length:var(--text-sm)] text-[var(--color-ink)]">{formatDate(job.subscriptions.updatedAt)}</p>
              </div>
              {pushEndpoint && (
                <div className="col-span-full min-w-0">
                  <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] mb-[var(--space-3xs)]">Push Endpoint</p>
                  <p className="font-mono text-[length:var(--text-xs)] text-[var(--color-ink-2)] break-all leading-relaxed min-w-0 [overflow-wrap:anywhere]">
                    {pushEndpoint}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-[var(--space-2xs)] text-[length:var(--text-sm)] text-[var(--color-ink-2)]">No subscription registered.</p>
          )}
        </section>

        {/* Payment Plans */}
        <section className="flex flex-col gap-[var(--space-2xs)]">
          <h2 className="font-display text-[length:var(--text-md)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
            Payment Plans
            {job.paymentPlans.length > 0 && (
              <span className="ml-2 font-body text-[length:var(--text-sm)] font-normal text-[var(--color-ink-2)]">
                ({job.paymentPlans.length})
              </span>
            )}
          </h2>
          {job.paymentPlans.length > 0 ? (
            job.paymentPlans.map((plan) => (
              <PaymentPlanCard key={plan.id} plan={plan} />
            ))
          ) : (
            <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] py-[var(--space-2xs)]">
              No payment plans attached.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
