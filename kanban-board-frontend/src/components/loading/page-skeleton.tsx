import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mt-8 h-64 w-full" />
    </div>
  );
}
