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
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Job info */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between gap-4">
            <h1 className="text-lg font-semibold text-white">{job.name}</h1>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                job.enabled
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-neutral-700/50 text-neutral-400"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  job.enabled ? "bg-emerald-400" : "bg-neutral-500"
                }`}
              />
              {job.enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-400 mb-1">Cron Expression</p>
              <code className="text-sm bg-neutral-800 text-indigo-300 px-2.5 py-1.5 rounded font-mono">
                {job.cron.trim()}
              </code>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-1">Job ID</p>
              <code className="text-xs text-neutral-400 font-mono break-all">{job.id}</code>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-1">Last Run</p>
              <p className="text-sm text-white">{formatDate(job.lastRunAt)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-1">Created</p>
              <p className="text-sm text-white">{formatDate(job.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-800">
            <h2 className="text-base font-semibold text-white">Push Subscription</h2>
          </div>
          {job.subscriptions ? (
            <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-400 mb-1">Status</p>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
                    job.subscriptions.isActive
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-neutral-700/50 text-neutral-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      job.subscriptions.isActive ? "bg-emerald-400" : "bg-neutral-500"
                    }`}
                  />
                  {job.subscriptions.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">Subscription ID</p>
                <code className="text-xs text-neutral-400 font-mono break-all">
                  {job.subscriptions.id}
                </code>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">Subscribed At</p>
                <p className="text-sm text-white">{formatDate(job.subscriptions.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">Updated At</p>
                <p className="text-sm text-white">{formatDate(job.subscriptions.updatedAt)}</p>
              </div>
              {pushEndpoint && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-neutral-400 mb-1">Push Endpoint</p>
                  <p className="text-xs text-neutral-500 font-mono break-all leading-relaxed">
                    {pushEndpoint}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="px-5 py-6 text-sm text-neutral-400">No subscription registered.</p>
          )}
        </div>

        {/* Payment Plans */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-white">
            Payment Plans
            {job.paymentPlans.length > 0 && (
              <span className="ml-2 text-xs font-normal text-neutral-400">
                ({job.paymentPlans.length})
              </span>
            )}
          </h2>
          {job.paymentPlans.length > 0 ? (
            job.paymentPlans.map((plan) => (
              <PaymentPlanCard key={plan.id} plan={plan} />
            ))
          ) : (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-6">
              <p className="text-sm text-neutral-400">No payment plans attached.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
