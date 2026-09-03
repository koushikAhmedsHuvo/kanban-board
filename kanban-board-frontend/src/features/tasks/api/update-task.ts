import { apiClient } from "@/lib/axios";
import type { Task, UpdateTaskRequest } from "../types/task.types";
export async function updateTask(taskId: string, data: UpdateTaskRequest) {
  const response = await apiClient.patch<Task>(`/tasks/${taskId}`, data);
  return response.data;
}
