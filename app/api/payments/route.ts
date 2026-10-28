import { revalidateTag } from "next/cache";

/**
 * Proxy for payment creation. Forwards the payload to the backend API and
 * purges the cached job data so the next render picks up the new payment.
 */
export async function POST(req: Request) {
  const body = await req.text();

  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
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
