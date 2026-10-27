import { Skeleton } from "@/components/ui/Skeleton";

const grid =
  "grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-x-[var(--space-xs)] gap-y-[var(--space-2xs)]";

function Facts({ n }: { n: number }) {
  return (
    <div className={grid}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-[var(--space-3xs)] h-4 w-36" />
        </div>
      ))}
    </div>
  );
}

export default function JobDetailLoading() {
  return (
    <div className="flex flex-col gap-[var(--space-sm)] max-w-3xl mx-auto w-full">
      {/* Back link */}
      <Skeleton className="h-5 w-36" />

      {/* Header */}
      <div className="flex items-center justify-between gap-[var(--space-2xs)] pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-6 w-20 rounded-[var(--radius-pill)]" />
      </div>

      {/* Facts */}
      <div className="pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
        <Facts n={4} />
      </div>

      {/* Subscription */}
      <div className="pb-[var(--space-sm)] border-b border-[var(--color-rule)]">
        <Skeleton className="h-6 w-40" />
        <div className="mt-[var(--space-2xs)]">
          <Facts n={4} />
        </div>
      </div>

      {/* Payment plans */}
      <div className="flex flex-col gap-[var(--space-2xs)]">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-36 w-full" />
      </div>
    </div>
  );
}
