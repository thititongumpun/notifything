"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { describeCron, nextRun } from "@/lib/cron";
import { fmtThaiDateTime } from "@/lib/format";
import { DateLeaf } from "@/components/calendar/DateLeaf";
import { CronSchedule } from "@/components/ui/CronSchedule";
import { readError } from "@/lib/http";
import { CRON_PRESETS } from "./presets";
import { backLink, btnPrimary, btnSecondary, card, dangerCallout, input } from "@/components/ui/styles";

const labelClass =
  "text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)]";

function RequiredMark() {
  return (
    <span className="text-[var(--color-danger)]" aria-hidden>
      *
    </span>
  );
}

export function AddJobForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [cron, setCron] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = cron.trim() ? nextRun(cron.trim(), new Date()) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/jobs/addjob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), cron: cron.trim() }),
      });
      if (!res.ok) throw new Error(await readError(res));
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(`เพิ่มงานไม่สำเร็จ: ${err instanceof Error ? err.message : "เกิดข้อผิดพลาด"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-[var(--space-xs)] w-full">
      <Link href="/dashboard" className={backLink}>
        <ArrowLeft className="w-4 h-4" aria-hidden />
        กลับ
      </Link>

      <div className={`${card} overflow-hidden`}>
        <div className="px-[var(--space-sm)] py-[var(--space-xs)] border-b border-[var(--color-rule)] sm:px-[var(--space-md)] sm:py-[var(--space-sm)]">
          <h1 className="font-display text-[length:var(--text-md)] font-semibold leading-[var(--leading-tight)] tracking-[-0.02em] text-[var(--color-ink)]">
            เพิ่มงาน
          </h1>
          <p className="text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)] mt-[var(--space-3xs)]">
            สร้างการแจ้งเตือนตามกำหนดเวลา
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-[var(--space-sm)] py-[var(--space-sm)] flex flex-col sm:px-[var(--space-md)]">
          {/* Name group */}
          <div className="flex flex-col gap-[var(--space-3xs)] py-[var(--space-2xs)]">
            <label className={labelClass} htmlFor="job-name">
              ชื่องาน <RequiredMark />
            </label>
            <input
              id="job-name"
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น ค่างวดรถ"
              className={input}
            />
          </div>

          <hr className="border-t border-[var(--color-rule)]" />

          {/* Cron group */}
          <div className="flex flex-col gap-[var(--space-3xs)] py-[var(--space-2xs)]">
            <label className={labelClass} htmlFor="job-cron">
              กำหนดเวลา (cron) <RequiredMark />
            </label>
            <input
              id="job-cron"
              required
              type="text"
              value={cron}
              onChange={(e) => setCron(e.target.value)}
              placeholder="เช่น 0 12 5 * *"
              aria-describedby="job-cron-hint"
              className={`${input} font-mono`}
            />
            <div id="job-cron-hint" aria-live="polite" className="min-w-0">
              {cron.trim() ? (
                <CronSchedule cron={cron} />
              ) : (
                <p lang="th" className="text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)]">
                  รูปแบบ: นาที ชั่วโมง วันที่ เดือน วันในสัปดาห์
                </p>
              )}
            </div>
            <div className="mt-[var(--space-3xs)] flex items-center gap-[var(--space-2xs)]">
              <DateLeaf date={next} size="sm" />
              <div className="min-w-0 text-[length:var(--text-sm)] leading-[var(--leading-body)]">
                <div className="text-[length:var(--text-xs)] text-[var(--color-ink-2)]">รอบถัดไป</div>
                <div className="text-[var(--color-ink)]">{next ? fmtThaiDateTime(next) : "—"}</div>
              </div>
            </div>
            {/* Presets */}
            <div className="flex flex-wrap gap-[var(--space-3xs)] mt-[var(--space-3xs)]">
              {CRON_PRESETS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCron(value)}
                  className={`min-h-[44px] min-w-0 text-left px-3 py-2 rounded-[var(--radius-input)] border transition-[color,border-color,transform,background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] active:translate-y-[1px] ${
                    cron.trim() === value
                      ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                      : "border-[var(--color-rule)] text-[var(--color-ink-2)] hover:border-[var(--color-ink-2)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-3)]"
                  }`}
                >
                  <span lang="th" className="block text-[length:var(--text-xs)] leading-[var(--leading-body)]">
                    {describeCron(value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p role="alert" className={dangerCallout}>
              {error}
            </p>
          )}

          {/* Actions — stacked full-width below sm */}
          <div className="flex flex-col items-stretch gap-[var(--space-2xs)] pt-[var(--space-2xs)] border-t border-[var(--color-rule)] mt-[var(--space-2xs)] sm:flex-row sm:items-center">
            <Link
              href="/dashboard"
              className={`${btnSecondary} w-full sm:w-auto`}
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={loading || !name.trim() || !cron.trim()}
              className={`${btnPrimary} w-full sm:ml-auto sm:w-auto`}
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden />}
              {loading ? "กำลังเพิ่ม…" : "เพิ่มงาน"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
