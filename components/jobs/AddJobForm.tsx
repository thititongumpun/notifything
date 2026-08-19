"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

const CRON_PRESETS = [
  { label: "Every day at noon", value: "0 12 * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every weekday at 9am", value: "0 9 * * 1-5" },
  { label: "Every Monday at 8am", value: "0 8 * * 1" },
  { label: "1st of month at noon", value: "0 12 1 * *" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
];

const inputClass =
  "w-full bg-[var(--color-paper-3)] border border-[var(--color-rule)] rounded-[var(--radius-input)] px-3 min-h-[44px] py-2 text-[length:var(--text-sm)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-2)] focus:outline-none transition-colors duration-[var(--dur-short)]";

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/addjob`, {
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
    <div className="flex flex-col gap-[var(--space-2xs)] w-full">
      <Link
        href="/dashboard"
        className="inline-flex min-h-[44px] items-center gap-1.5 text-[length:var(--text-sm)] text-[var(--color-ink-2)] transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] hover:text-[var(--color-ink)] active:translate-y-[1px]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] overflow-hidden">
        <div className="px-[var(--space-xs)] py-[var(--space-2xs)] border-b border-[var(--color-rule)]">
          <h1 className="font-display text-[length:var(--text-md)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
            Add Job
          </h1>
          <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)] mt-[var(--space-3xs)]">
            Create a new scheduled notification job.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-[var(--space-xs)] py-[var(--space-xs)] flex flex-col">
          {/* Name group */}
          <div className="flex flex-col gap-[var(--space-3xs)] py-[var(--space-2xs)]">
            <label className="text-[length:var(--text-sm)] font-medium text-[var(--color-ink-2)]" htmlFor="job-name">
              Name <span className="text-[var(--color-danger)]">*</span>
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
            <label className="text-[length:var(--text-sm)] font-medium text-[var(--color-ink-2)]" htmlFor="job-cron">
              Cron Expression <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              id="job-cron"
              required
              type="text"
              value={cron}
              onChange={(e) => setCron(e.target.value)}
              placeholder="e.g. 0 12 5 * *"
              className={`${inputClass} font-mono`}
            />
            {/* Presets */}
            <div className="flex flex-wrap gap-[var(--space-3xs)] mt-[var(--space-3xs)]">
              {CRON_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setCron(p.value)}
                  className={`min-h-[44px] text-[length:var(--text-sm)] px-3 py-2 rounded-[var(--radius-pill)] border transition-[color,border-color,transform,background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] active:translate-y-[1px] ${
                    cron.trim() === p.value
                      ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                      : "border-[var(--color-rule)] text-[var(--color-ink-2)] hover:border-[var(--color-ink-2)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-3)]"
                  }`}
                >
                  <span className="font-mono">{p.value}</span>
                  <span className="ml-1.5">— {p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-t border-[var(--color-rule)]" />

          {/* Preview */}
          {cron && (
            <div className="flex items-center gap-[var(--space-3xs)] py-[var(--space-2xs)] text-[length:var(--text-sm)]">
              <span className="text-[var(--color-ink-2)]">Preview:</span>
              <code className="font-mono text-[var(--color-accent)] min-w-0 [overflow-wrap:anywhere]">
                {cron.trim()}
              </code>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-[length:var(--text-sm)] text-[var(--color-danger)] border border-[var(--color-danger)] rounded-[var(--radius-input)] px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-[var(--space-2xs)] pt-[var(--space-2xs)] border-t border-[var(--color-rule)] mt-[var(--space-2xs)]">
            <Link
              href="/dashboard"
              className="inline-flex min-h-[44px] items-center px-4 py-2 rounded-[10px] text-[length:var(--text-sm)] text-[var(--color-ink-2)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] transition-[transform,background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] active:translate-y-[1px]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !name.trim() || !cron.trim()}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 px-4 py-2 rounded-[10px] text-[length:var(--text-sm)] font-medium bg-[var(--color-accent)] text-[var(--color-accent-ink)] transition-[transform,filter] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:brightness-110 hover:-translate-y-[1px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Creating…" : "Add job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
