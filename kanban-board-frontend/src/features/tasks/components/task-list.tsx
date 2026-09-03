"use client";
import { useState } from "react";
import type { Task } from "../types/task.types";
import { useColumnTasks } from "../hooks/use-column-tasks";
import { TaskSkeleton } from "./task-skeleton";
import { EmptyTask } from "./empty-task";
import { SortableTask } from "./sortable-task";
import dynamic from "next/dynamic";
const LazyTaskDetailsDialog = dynamic(() =>
  import("./task-details-dialog").then((module) => module.TaskDetailsDialog),
);
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTaskSearch } from "@/features/search/use-task-search";
export function TaskList({
  columnId,
  canManage,
  createAction,
  search,
}: {
  columnId: string;
  canManage: boolean;
  createAction?: React.ReactNode;
  search?: string;
}) {
  const query = useColumnTasks(columnId);
  const [selected, setSelected] = useState<Task | null>(null);
  const tasks = useTaskSearch(query.data ?? [], search ?? "");
  if (query.isLoading) return <TaskSkeleton />;
  if (query.isError)
    return (
      <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
        Unable to load tasks.
      </p>
    );
  if (!tasks.length)
    return <EmptyTask canManage={canManage} action={createAction} />;
  return (
    <>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-2">
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              canMove={canManage}
              onOpen={() => setSelected(task)}
            />
          ))}
        </div>
      </SortableContext>
      {selected && (
        <LazyTaskDetailsDialog
          taskId={selected.id}
          columnId={columnId}
          canManage={canManage}
          open
          onOpenChange={(open) => !open && setSelected(null)}
        />
      )}
    </>
  );
}
