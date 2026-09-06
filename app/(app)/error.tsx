"use client";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div>
        <p className="text-sm font-medium text-red-400">Something went wrong</p>
        <p className="mt-1 text-xs text-neutral-500">{error.message || "Failed to load data."}</p>
      </div>
      <button
        onClick={reset}
        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
      >
        Try Again
      </button>
    </div>
  );
}
