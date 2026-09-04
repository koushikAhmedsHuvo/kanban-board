import { BoardCard } from "./board-card";
import { BoardSkeleton } from "@/components/loading/board-skeleton";
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
      <BoardSkeleton />
    );
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {boards?.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  );
}
