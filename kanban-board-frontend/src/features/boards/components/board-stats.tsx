"use client";

import { useQueryClient } from "@tanstack/react-query";
import { COLUMN_KEYS } from "@/features/columns/hooks/use-columns";
import { MEMBER_KEYS } from "@/features/board-members/hooks/use-members";
import { TASK_KEYS } from "@/features/tasks/hooks/use-column-tasks";

export function BoardStats({ boardId }: { boardId: string }) {
  const client = useQueryClient();
  const columns =
    client.getQueryData<Array<{ id: string; title: string }>>(
      COLUMN_KEYS.board(boardId),
    ) ?? [];
  const tasks = columns.flatMap(
    (column) =>
      client.getQueryData<Array<{ id: string; title: string }>>(
        TASK_KEYS.column(column.id),
      ) ?? [],
  );
  const members =
    client.getQueryData<Array<unknown>>(MEMBER_KEYS.board(boardId)) ?? [];
  const completedColumnIds = new Set(
    columns
      .filter((column) => /done|complete|finished/i.test(column.title))
      .map((column) => column.id),
  );
  const completed = columns
    .filter((column) => completedColumnIds.has(column.id))
    .flatMap(
      (column) =>
        client.getQueryData<Array<unknown>>(TASK_KEYS.column(column.id)) ?? [],
    ).length;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat label="Tasks total" value={tasks.length} />
      <Stat label="Tasks completed" value={completed} />
      <Stat label="Tasks in progress" value={tasks.length - completed} />
      <Stat label="Members" value={members.length} />
    </div>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
