import { apiClient } from "@/lib/axios";
import type { MoveTaskRequest } from "../types/task.types";
export async function moveTask(taskId: string, data: MoveTaskRequest) {
  const response = await apiClient.post<{ message: string }>(
    `/tasks/${taskId}/move`,
    data,
  );
  return response.data;
}
