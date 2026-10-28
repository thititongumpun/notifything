/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { describeCron } from "@/lib/cron";
import { CRON_PRESETS } from "./presets";
import { backLink, btnPrimary, btnSecondary, dangerCallout } from "@/components/ui/styles";

const inputClass =
  "w-full bg-[var(--color-paper-3)] border border-[var(--color-rule)] rounded-[var(--radius-input)] px-3 min-h-[44px] py-2 text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-2)] transition-colors duration-[var(--dur-short)]";

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
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-[var(--space-xs)] w-full">
      <Link href="/dashboard" className={backLink}>
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to dashboard
      </Link>

      <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] overflow-hidden">
        <div className="px-[var(--space-sm)] py-[var(--space-xs)] border-b border-[var(--color-rule)] sm:px-[var(--space-md)] sm:py-[var(--space-sm)]">
          <h1 className="font-display text-[length:var(--text-md)] font-semibold leading-[var(--leading-tight)] tracking-[-0.02em] text-[var(--color-ink)]">
            Add job
          </h1>
          <p className="text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)] mt-[var(--space-3xs)]">
            Create a new scheduled notification job.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-[var(--space-sm)] py-[var(--space-sm)] flex flex-col sm:px-[var(--space-md)]">
          {/* Name group */}
          <div className="flex flex-col gap-[var(--space-3xs)] py-[var(--space-2xs)]">
            <label className={labelClass} htmlFor="job-name">
              Name <RequiredMark />
            </label>
            <input
              id="job-name"
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ค่างวดรถ"
              className={inputClass}
            />
          </div>

          <hr className="border-t border-[var(--color-rule)]" />

          {/* Cron group */}
          <div className="flex flex-col gap-[var(--space-3xs)] py-[var(--space-2xs)]">
            <label className={labelClass} htmlFor="job-cron">
              Cron expression <RequiredMark />
            </label>
            <input
              id="job-cron"
              required
              type="text"
              value={cron}
              onChange={(e) => setCron(e.target.value)}
              placeholder="e.g. 0 12 5 * *"
              aria-describedby="job-cron-hint"
              className={`${inputClass} font-mono`}
            />
            <p
              id="job-cron-hint"
              aria-live="polite"
              lang="th"
              className="text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)] min-w-0 [overflow-wrap:anywhere]"
            >
              {cron.trim() ? describeCron(cron) : "รูปแบบ: นาที ชั่วโมง วันที่ เดือน วันในสัปดาห์"}
            </p>
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
                  <span className="block font-mono tabular-nums text-[length:var(--text-sm)]">{value}</span>
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
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !name.trim() || !cron.trim()}
              className={`${btnPrimary} w-full sm:ml-auto sm:w-auto`}
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden />}
              {loading ? "Creating…" : "Add job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
