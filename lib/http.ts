/** Message for a failed fetch: JSON `error`/`message` if present, else a Thai fallback. Never returns a raw body. */
export async function readError(res: Response): Promise<string> {
  const j = await res.json().catch(() => null);
  const m = j?.error ?? j?.message;
  return typeof m === "string" && m ? m : `เกิดข้อผิดพลาด (HTTP ${res.status})`;
}
