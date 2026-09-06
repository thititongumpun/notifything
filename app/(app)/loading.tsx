import { Skeleton } from "@/components/ui/Skeleton";

export default function AppLoading() {
  return (
    <div className="flex flex-col gap-[var(--space-md)]">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-40 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-72 w-full rounded-[var(--radius-card)]" />
    </div>
  );
}
