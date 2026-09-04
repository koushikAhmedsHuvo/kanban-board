"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { deleteTask } from "../api/delete-task";
import { TASK_KEYS } from "./use-column-tasks";
export function useDeleteTask(columnId: string) {
  const client = useQueryClient();
  return useMutation({
    onMutate: () => toastInfo("Deleting Task..."),
    mutationFn: deleteTask,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: TASK_KEYS.column(columnId) });
      toastSuccess("Task Deleted");
    },
    onError: () => toastError("Unable to delete task"),
  });
}
