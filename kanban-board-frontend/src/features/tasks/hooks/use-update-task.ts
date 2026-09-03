"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { updateTask } from "../api/update-task";
import { TASK_KEYS } from "./use-column-tasks";
export function useUpdateTask(columnId: string) {
  const client = useQueryClient();
  return useMutation({
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
      toast.success("Task updated");
    },
    onError: () => toast.error("Unable to update task"),
  });
}
