"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";
import type { Job } from "@/lib/types";
import { describeCron } from "@/lib/cron";
import { CronSchedule } from "@/components/ui/CronSchedule";
import { StatusChip } from "@/components/ui/StatusChip";
import { btnPrimary, btnSecondary, dangerCallout, input } from "@/components/ui/styles";
import { CRON_PRESETS } from "./presets";

async function patchJob(id: string, body: object) {
  const res = await fetch(`/api/jobs/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      const j = JSON.parse(text);
      msg = j.error ?? j.message ?? text;
    } catch {}
    throw new Error(typeof msg === "string" && msg ? msg : `Error ${res.status}`);
  }
}

const labelClass = "text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)]";

export function JobEditor({ job }: { job: Job }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(job.name);
  const [cron, setCron] = useState(job.cron);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(job.enabled);
  const [toggling, setToggling] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const patch = {
    ...(name.trim() !== job.name && { name: name.trim() }),
    ...(cron.trim() !== job.cron && { cron: cron.trim() }),
  };
  const canSave = !pending && name.trim() !== "" && Object.keys(patch).length > 0;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    setPending(true);
    setError(null);
    try {
      await patchJob(job.id, patch);
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(`บันทึกไม่สำเร็จ: ${err instanceof Error ? err.message : "เกิดข้อผิดพลาด"}`);
    } finally {
      setPending(false);
    }
  }

  function cancel() {
    setName(job.name);
    setCron(job.cron);
    setError(null);
    setEditing(false);
  }

  async function toggle() {
    const next = !enabled;
    setEnabled(next);
    setToggling(true);
    setToggleError(null);
    try {
      await patchJob(job.id, { enabled: next });
      router.refresh();
    } catch (err) {
      setEnabled(!next);
      setToggleError(`บันทึกไม่สำเร็จ: ${err instanceof Error ? err.message : "เกิดข้อผิดพลาด"}`);
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-2xs)]">
      <h1 className="min-w-0 font-display text-[length:var(--text-lg)] font-semibold leading-[var(--leading-tight)] tracking-[-0.02em] text-[var(--color-ink)] [overflow-wrap:anywhere]">
        {job.name}
      </h1>

      <div className="flex flex-wrap items-center gap-[var(--space-xs)]">
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={toggle}
          disabled={toggling}
          className="inline-flex min-h-[44px] items-center gap-2 text-[length:var(--text-sm)] text-[var(--color-ink)] disabled:opacity-50"
        >
          <span
            aria-hidden
            className={`relative h-6 w-11 rounded-full border border-[var(--color-rule)] transition-colors duration-[var(--dur-short)] ${enabled ? "bg-[var(--color-accent)]" : "bg-[var(--color-track)]"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-4.5 w-4.5 rounded-full bg-[var(--color-paper)] transition-transform duration-[var(--dur-short)] ${enabled ? "translate-x-5" : ""}`}
            />
          </span>
          เปิดใช้งาน
        </button>
        <StatusChip on={enabled} label={enabled ? "เปิด" : "ปิด"} />
      </div>
      {toggleError && (
        <p role="alert" className={dangerCallout}>
          {toggleError}
        </p>
      )}

      {editing ? (
        <form onSubmit={save} className="flex flex-col gap-[var(--space-2xs)]">
          <label className="flex flex-col gap-[var(--space-3xs)]">
            <span className={labelClass}>ชื่องาน</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} className={input} />
          </label>
          <label className="flex flex-col gap-[var(--space-3xs)]">
            <span className={labelClass}>ตารางเวลา (cron)</span>
            <input value={cron} onChange={(e) => setCron(e.target.value)} className={`${input} font-mono`} />
          </label>
          <div aria-live="polite">
            <CronSchedule cron={cron} />
          </div>
          <div className="flex flex-wrap gap-[var(--space-3xs)]">
            {CRON_PRESETS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCron(value)}
                className={`min-h-[44px] rounded-[var(--radius-input)] border px-3 py-2 text-left text-[length:var(--text-xs)] transition-colors duration-[var(--dur-short)] ${
                  cron.trim() === value
                    ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                    : "border-[var(--color-rule)] text-[var(--color-ink-2)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)]"
                }`}
              >
                <span lang="th">{describeCron(value)}</span>
              </button>
            ))}
          </div>
          {error && (
            <p role="alert" className={dangerCallout}>
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-[var(--space-2xs)]">
            <button type="submit" disabled={!canSave} className={btnPrimary}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              บันทึก
            </button>
            <button type="button" onClick={cancel} disabled={pending} className={btnSecondary}>
              ยกเลิก
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-[var(--space-2xs)]">
          <CronSchedule cron={job.cron} />
          <button type="button" onClick={() => setEditing(true)} className={btnSecondary}>
            <Pencil className="h-4 w-4" aria-hidden />
            แก้ไข
          </button>
        </div>
      )}
    </div>
  );
}
