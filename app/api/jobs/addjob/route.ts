import { revalidateTag } from "next/cache";

/**
 * Proxy for job creation. Forwards the payload to the backend API and
 * purges the cached job list so the dashboard shows the new job.
 */
export async function POST(req: Request) {
  const body = await req.text();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/addjob`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (res.ok) {
    revalidateTag("jobs", "max");
  }

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
