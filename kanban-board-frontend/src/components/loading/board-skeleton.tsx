import { Skeleton } from "@/components/ui/skeleton";

export function BoardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <Skeleton className="h-36" key={item} />
      ))}
    </div>
  );
}
