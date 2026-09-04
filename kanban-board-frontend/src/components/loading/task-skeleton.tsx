import { Skeleton } from "@/components/ui/skeleton";

export function TaskSkeleton() {
  return (
    <div className="grid gap-2">
      {[1, 2, 3].map((item) => (
        <Skeleton className="h-20" key={item} />
      ))}
    </div>
  );
}
