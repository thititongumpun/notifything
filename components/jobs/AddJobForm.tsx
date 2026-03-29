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
    <div className="flex flex-col gap-6 max-w-lg mx-auto w-full">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-800">
          <h1 className="text-base font-semibold text-white">Add Job</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Create a new scheduled notification job.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ค่างวดรถ"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Cron */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Cron Expression <span className="text-red-400">*</span>
            </label>
            <input
              required
              type="text"
              value={cron}
              onChange={(e) => setCron(e.target.value)}
              placeholder="e.g. 0 12 5 * *"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {CRON_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setCron(p.value)}
                  className="text-xs px-2 py-1 rounded-md bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors font-mono"
                >
                  {p.value}
                  <span className="font-sans text-neutral-500 ml-1">— {p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {cron && (
            <div className="rounded-lg bg-neutral-800/60 border border-neutral-700 px-3 py-2.5 flex items-center gap-2">
              <span className="text-xs text-neutral-400">Preview:</span>
              <code className="text-xs text-indigo-300 font-mono">{cron.trim()}</code>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !name.trim() || !cron.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Creating…" : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
