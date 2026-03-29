import Link from "next/link";
import type { Job } from "@/lib/types";

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

export function JobsTable({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-neutral-400 text-sm">No jobs found.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wide">
              Name
            </th>
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wide">
              Cron
            </th>
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wide">
              Status
            </th>
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wide">
              Last Run
            </th>
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wide">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-neutral-800/50 transition-colors">
              <td className="px-5 py-3.5 font-medium">
                <Link href={`/jobs/${job.id}`} className="text-white hover:text-indigo-400 transition-colors">
                  {job.name}
                </Link>
              </td>
              <td className="px-5 py-3.5">
                <code className="text-xs bg-neutral-800 text-indigo-300 px-2 py-1 rounded font-mono">
                  {job.cron.trim()}
                </code>
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
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
              </td>
              <td className="px-5 py-3.5 text-neutral-400">{formatDate(job.lastRunAt)}</td>
              <td className="px-5 py-3.5 text-neutral-400">{formatDate(job.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
