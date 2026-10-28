import { revalidateTag } from "next/cache";

/**
 * Proxy for job creation. Forwards the payload to the backend API and
 * purges the cached job list so the dashboard shows the new job.
 */
export async function POST(req: Request) {
  const body = await req.text();

  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/addjob`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  } catch {
    return Response.json({ error: "เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ" }, { status: 502 });
  }

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
