import type { Job, JobDetail } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Shared fetch options: pages are served from cache and revalidated in the
 *  background. Mutations go through app/api proxies that call
 *  revalidateTag("jobs", "max"), so writes always show immediately. */
const CACHE = { next: { revalidate: 60, tags: ["jobs"] } };

export async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${API_URL}/jobs`, CACHE);
  if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
  return res.json();
}

export async function getJobDetail(id: string): Promise<JobDetail> {
  const res = await fetch(`${API_URL}/jobs/${id}`, CACHE);
  if (!res.ok) throw new Error(`Failed to fetch job ${id}`);
  return res.json();
}
