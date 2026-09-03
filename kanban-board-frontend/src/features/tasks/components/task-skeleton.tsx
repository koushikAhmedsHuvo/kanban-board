import { Skeleton } from "@/components/ui/skeleton";
export function TaskSkeleton() {
  return (
    <div className="grid gap-2">
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>
  );
}
