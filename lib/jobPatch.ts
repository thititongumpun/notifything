export type JobPatch = { name?: string; cron?: string; enabled?: boolean };
export type JobPatchResult = { ok: true; value: JobPatch } | { ok: false; error: string };

const MACROS = new Set(["@hourly", "@daily", "@midnight", "@weekly", "@monthly", "@yearly", "@annually"]);

/** Validates the body of PATCH /jobs/:id (backend rejects unknown keys). */
export function parseJobPatch(body: unknown): JobPatchResult {
  if (typeof body !== "object" || body === null || Array.isArray(body))
    return { ok: false, error: "ข้อมูลไม่ถูกต้อง" };
  const b = body as Record<string, unknown>;
  const value: JobPatch = {};
  for (const k of Object.keys(b)) {
    if (k !== "name" && k !== "cron" && k !== "enabled") return { ok: false, error: `ไม่รองรับฟิลด์ ${k}` };
  }
  if ("name" in b) {
    const name = typeof b.name === "string" ? b.name.trim() : "";
    if (name.length < 1 || name.length > 100) return { ok: false, error: "ชื่อต้องยาว 1-100 ตัวอักษร" };
    value.name = name;
  }
  if ("cron" in b) {
    const cron = typeof b.cron === "string" ? b.cron.trim() : "";
    if (!(cron.split(/\s+/).length === 5 || MACROS.has(cron))) return { ok: false, error: "รูปแบบ cron ไม่ถูกต้อง" };
    value.cron = cron;
  }
  if ("enabled" in b) {
    if (typeof b.enabled !== "boolean") return { ok: false, error: "enabled ต้องเป็น true หรือ false" };
    value.enabled = b.enabled;
  }
  if (Object.keys(value).length === 0) return { ok: false, error: "ไม่มีข้อมูลที่จะแก้ไข" };
  return { ok: true, value };
}
