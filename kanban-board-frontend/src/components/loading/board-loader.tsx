import { Skeleton } from "@/components/ui/skeleton";
export function BoardLoader() { return <div className="mx-auto max-w-6xl p-6"><Skeleton className="h-10 w-72" /><div className="mt-8 flex gap-4"><Skeleton className="h-64 min-w-72" /><Skeleton className="h-64 min-w-72" /><Skeleton className="h-64 min-w-72" /></div></div>; }
