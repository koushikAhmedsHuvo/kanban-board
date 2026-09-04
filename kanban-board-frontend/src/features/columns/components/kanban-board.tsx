"use client";

import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Column } from "../types/column.types";
import { useMoveColumn } from "../hooks/use-move-column";
import { ColumnCard } from "./column-card";
import { ColumnSkeleton } from "@/components/loading/column-skeleton";
import { EmptyColumn } from "./empty-column";
import { useMoveTask } from "@/features/tasks/hooks/use-move-task";
import type { Task } from "@/features/tasks/types/task.types";

export function calculatePosition(
  previousPosition?: number,
  nextPosition?: number,
) {
  if (previousPosition === undefined)
    return Math.max(1, (nextPosition ?? 1000) - 500);
  if (nextPosition === undefined) return previousPosition + 1000;
  return Math.floor((previousPosition + nextPosition) / 2);
}

export function KanbanBoard({
  boardId,
  columns,
  isLoading,
  canManage,
  emptyAction,
  search,
  columnFilter,
}: {
  boardId: string;
  columns?: Column[];
  isLoading: boolean;
  canManage: boolean;
  emptyAction?: React.ReactNode;
  search?: string;
  columnFilter?: string;
}) {
  const client = useQueryClient();
  const moveColumn = useMoveColumn(boardId);
  const moveTask = useMoveTask();
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !columns || !canManage) return;
    const activeColumn = columns.some((column) => column.id === active.id);
    if (activeColumn) {
      if (active.id === over.id) return;
      const from = columns.findIndex((column) => column.id === active.id);
      const to = columns.findIndex((column) => column.id === over.id);
      if (from < 0 || to < 0) return;
      const next = [...columns];
      const [moving] = next.splice(from, 1);
      next.splice(to, 0, moving);
      const targetPosition = calculatePosition(
        next[to - 1]?.position,
        next[to + 1]?.position,
      );
      if (targetPosition !== moving.position)
        moveColumn.mutate({ columnId: moving.id, targetPosition });
      return;
    }
    const entries = client.getQueriesData<Task[]>({ queryKey: ["tasks"] });
    const source = entries.find(([, tasks]) =>
      tasks?.some((task) => task.id === active.id),
    );
    if (!source) return;
    const targetColumn = columns.find((column) => column.id === over.id);
    const target = targetColumn
      ? undefined
      : entries.find(([, tasks]) => tasks?.some((task) => task.id === over.id));
    const targetColumnId = targetColumn?.id ?? String(target?.[0]?.[1] ?? "");
    if (!targetColumnId) return;
    const targetTasks = targetColumn
      ? (client.getQueryData<Task[]>(["tasks", targetColumn.id]) ?? [])
      : (target?.[1] ?? []);
    let targetIndex = targetColumn
      ? targetTasks.length
      : targetTasks.findIndex((task) => task.id === over.id);
    if (targetIndex < 0) targetIndex = targetTasks.length;
    if (source[0][1] === targetColumnId) {
      const sourceIndex =
        source[1]?.findIndex((task) => task.id === active.id) ?? -1;
      if (sourceIndex >= 0 && sourceIndex < targetIndex) targetIndex -= 1;
    }
    moveTask.mutate({ taskId: String(active.id), targetColumnId, targetIndex });
  }
  if (isLoading)
    return (
      <div className="flex min-h-64 gap-4 overflow-x-auto pb-4">
        {[1, 2, 3].map((item) => <ColumnSkeleton key={item} />)}
      </div>
    );
  if (!columns?.length)
    return <EmptyColumn canManage={canManage} action={emptyAction} />;
  const visibleColumns =
    columnFilter && columnFilter !== "all"
      ? columns.filter((column) => column.id === columnFilter)
      : columns;
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={columns.map((column) => column.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex min-h-64 gap-4 overflow-x-auto pb-4">
          {visibleColumns.map((column) => (
            <ColumnCard
              key={column.id}
              column={column}
              boardId={boardId}
              canManage={canManage}
              search={search}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
