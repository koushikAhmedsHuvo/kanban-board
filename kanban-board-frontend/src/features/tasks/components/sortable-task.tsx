"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types/task.types";
import { TaskCard } from "./task-card";
export function SortableTask({
  task,
  canMove,
  onOpen,
}: {
  task: Task;
  canMove: boolean;
  onOpen: () => void;
}) {
  const sortable = useSortable({ id: task.id, disabled: !canMove });
  return (
    <div
      ref={sortable.setNodeRef}
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      {...sortable.attributes}
      {...sortable.listeners}
    >
      <TaskCard task={task} onOpen={onOpen} />
    </div>
  );
}
