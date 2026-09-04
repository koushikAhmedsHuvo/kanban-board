"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { updateTask } from "../api/update-task";
import { TASK_KEYS } from "./use-column-tasks";
export function useUpdateTask(columnId: string) {
  const client = useQueryClient();
  return useMutation({
    onMutate: () => toastInfo("Updating Task..."),
    mutationFn: ({
      taskId,
      title,
      description,
    }: {
      taskId: string;
      title?: string;
      description?: string;
    }) => updateTask(taskId, { title, description }),
    onSuccess: (data) => {
      client.setQueryData(TASK_KEYS.task(data.id), data);
      client.invalidateQueries({ queryKey: TASK_KEYS.column(columnId) });
      toastSuccess("Task Updated");
    },
    onError: () => toastError("Unable to update task"),
  });
}
