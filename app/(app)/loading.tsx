import { Skeleton } from "@/components/ui/Skeleton";

export default function AppLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}
