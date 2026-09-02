import type { Job, JobDetail } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${API_URL}/jobs`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
  return res.json();
}

export async function getJobDetail(id: string): Promise<JobDetail> {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch job ${id}`);
  return res.json();
}
