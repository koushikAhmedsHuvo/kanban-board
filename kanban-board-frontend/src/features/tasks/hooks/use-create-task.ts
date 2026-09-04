"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { createTask } from "../api/create-task";
import { TASK_KEYS } from "./use-column-tasks";
export function useCreateTask(columnId: string) {
  const client = useQueryClient();
  return useMutation({
    onMutate: () => toastInfo("Creating Task..."),
    mutationFn: (data: { title: string; description?: string }) =>
      createTask(columnId, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: TASK_KEYS.column(columnId) });
      toastSuccess("Task Created");
    },
    onError: () => toastError("Unable to create task"),
  });
}
