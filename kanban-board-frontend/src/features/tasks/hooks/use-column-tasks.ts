"use client";
import { useQuery } from "@tanstack/react-query";
import { getColumnTasks } from "../api/get-column-tasks";
export const TASK_KEYS = {
  task: (id: string) => ["task", id] as const,
  column: (columnId: string) => ["tasks", columnId] as const,
};
export function useColumnTasks(columnId: string) {
  return useQuery({
    queryKey: TASK_KEYS.column(columnId),
    queryFn: () => getColumnTasks(columnId),
    enabled: Boolean(columnId),
    staleTime: 30_000,
  });
}
