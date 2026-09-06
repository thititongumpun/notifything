import { revalidateTag } from "next/cache";

/**
 * Proxy for payment creation. Forwards the payload to the backend API and
 * purges the cached job data so the next render picks up the new payment.
 */
export async function POST(req: Request) {
  const body = await req.text();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
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
