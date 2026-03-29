import { AppShell } from "@/components/layout/AppShell";
import { PaymentsClient } from "./components/PaymentsClient";
import type { JobDetail } from "@/lib/types";

const PAYMENT_JOB_IDS = [
  "tfcidrg1g1mc0smrq2xhl5lf", // ค่างวดรถ
  "tobengn1cfytol4a0yx2q3rw", // ค่าบ้าน
];

async function getJobDetail(id: string): Promise<JobDetail> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch job ${id}`);
  return res.json();
}

export default async function PaymentsPage() {
  const jobs = await Promise.all(PAYMENT_JOB_IDS.map(getJobDetail));

  return (
    <AppShell>
      <PaymentsClient jobs={jobs} />
    </AppShell>
  );
}
