import { apiClient } from "@/lib/axios";
import type { Task } from "../types/task.types";
export async function getColumnTasks(columnId: string) {
  const response = await apiClient.get<Task[]>(`/columns/${columnId}/tasks`);
  return response.data.sort((a, b) => a.position - b.position);
}
