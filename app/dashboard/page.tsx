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
      <div className="flex flex-col gap-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide">Total Jobs</p>
            <p className="text-2xl font-bold text-white mt-1">{jobs.length}</p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide">Active</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-neutral-400 uppercase tracking-wide">Disabled</p>
            <p className="text-2xl font-bold text-neutral-400 mt-1">{jobs.length - activeCount}</p>
          </div>
        </div>

        {/* Jobs table */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Scheduled Jobs</h2>
            <Link
              href="/jobs/new"
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Job
            </Link>
          </div>
          {error ? (
            <div className="px-5 py-8 text-center text-red-400 text-sm">{error}</div>
          ) : (
            <JobsTable jobs={jobs} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
