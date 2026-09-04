import { Skeleton } from "@/components/ui/skeleton";

export function MemberSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border p-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  );
}
