import { revalidateTag } from "next/cache";
import { parseJobPatch } from "@/lib/jobPatch";

/** Proxy for job edits (name/cron/enabled). Validates, forwards, then purges the jobs cache. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[\w-]+$/.test(id)) return Response.json({ error: "รหัสงานไม่ถูกต้อง" }, { status: 400 });
  const parsed = parseJobPatch(await req.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.value),
    });
  } catch {
    return Response.json({ error: "เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ" }, { status: 502 });
  }

  if (res.ok) revalidateTag("jobs", "max");

  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
