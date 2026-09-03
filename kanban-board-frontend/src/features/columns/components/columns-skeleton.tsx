import { Skeleton } from "@/components/ui/skeleton";
export function ColumnsSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3].map((item) => (
        <Skeleton className="h-48 min-w-72" key={item} />
      ))}
    </div>
  );
}
