import { BoardCard } from "./board-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Board } from "../types/board.types";
export function BoardList({
  boards,
  isLoading,
}: {
  boards?: Board[];
  isLoading: boolean;
}) {
  if (isLoading)
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Skeleton className="h-36" key={item} />
        ))}
      </div>
    );
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {boards?.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  );
}
