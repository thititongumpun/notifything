import { PaymentsClient, type JobEntry } from "./components/PaymentsClient";
import { getJobs, getJobDetail } from "@/lib/api";
import type { Job } from "@/lib/types";

export default async function PaymentsPage() {
  let jobs: Job[] = [];
  let listError: string | null = null;

  try {
    jobs = await getJobs();
  } catch (e) {
    listError = e instanceof Error ? e.message : "Failed to load jobs";
  }

  // Per-job isolation: one failed detail-fetch becomes an inline error card,
  // never a crashed page.
  const entries = await Promise.all(
    jobs.map(async (job): Promise<JobEntry> => {
      try {
        return { id: job.id, name: job.name, detail: await getJobDetail(job.id), error: null };
      } catch (e) {
        return {
          id: job.id,
          name: job.name,
          detail: null,
          error: e instanceof Error ? e.message : `Failed to load ${job.name}`,
        };
      }
    }),
  );

  return <PaymentsClient entries={entries} listError={listError} />;
}
