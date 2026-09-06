import { Skeleton } from "@/components/ui/Skeleton";

export default function JobDetailLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      {/* Back link */}
      <Skeleton className="h-4 w-36" />

      {/* Job info */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-20 mb-1.5" />
              <Skeleton className="h-5 w-36" />
            </div>
          ))}
        </div>
      </div>

      {/* Subscription */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-800">
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-20 mb-1.5" />
              <Skeleton className="h-5 w-40" />
            </div>
          ))}
        </div>
      </div>

      {/* Payment plans */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-800">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-3 w-44 mt-1.5" />
        </div>
        <div className="px-5 py-4">
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
