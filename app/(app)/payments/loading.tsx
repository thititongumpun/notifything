import { Skeleton } from "@/components/ui/Skeleton";

function PlanCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
      {/* Plan header */}
      <div className="px-5 py-4 border-b border-neutral-800">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-3 w-44 mt-1.5" />
      </div>
      {/* Summary stats */}
      <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-neutral-800">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-20 mt-1.5" />
          </div>
        ))}
      </div>
      {/* Progress bar */}
      <div className="px-5 py-4 border-b border-neutral-800">
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      {/* Chart */}
      <div className="px-5 py-4 border-b border-neutral-800">
        <Skeleton className="h-3 w-36 mb-3" />
        <Skeleton className="h-40 w-full" />
      </div>
      {/* Table rows */}
      <div className="divide-y divide-neutral-800/60">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-5 py-3">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-4 w-20" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PaymentsLoading() {
  return (
    <div className="flex flex-col gap-8">
      {Array.from({ length: 2 }).map((_, g) => (
        <div key={g} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          <PlanCardSkeleton />
        </div>
      ))}
    </div>
  );
}
