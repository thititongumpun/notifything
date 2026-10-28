import { revalidateTag } from "next/cache";
import { parseJobPatch } from "@/lib/jobPatch";

/** Proxy for job edits (name/cron/enabled). Validates, forwards, then purges the jobs cache. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = parseJobPatch(await req.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.value),
  });

  if (res.ok) revalidateTag("jobs", "max");

  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
