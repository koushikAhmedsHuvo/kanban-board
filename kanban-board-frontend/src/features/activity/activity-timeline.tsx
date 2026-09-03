"use client";

import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivity } from "./hooks/use-activity";

export function ActivityTimeline({ boardId }: { boardId: string }) {
  const activity = useActivity(boardId);
  const items = activity.data?.pages.flatMap((page) => page.items) ?? [];
  return (
    <div className="space-y-4">
      {activity.isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : items.length ? (
        items.map((item) => (
          <div className="flex gap-3" key={item.id}>
            <Clock3 className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-sm">
                <span className="font-medium">{item.actor.name}</span>{" "}
                {item.action}
                {item.task ? ` ${item.task.title}` : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      )}
      {activity.hasNextPage && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => activity.fetchNextPage()}
          disabled={activity.isFetchingNextPage}
        >
          {activity.isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      )}
    </div>
  );
}
