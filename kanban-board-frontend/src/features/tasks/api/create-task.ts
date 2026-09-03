import { apiClient } from "@/lib/axios";
import type { CreateTaskRequest, Task } from "../types/task.types";
export async function createTask(columnId: string, data: CreateTaskRequest) {
  const response = await apiClient.post<Task>(
    `/columns/${columnId}/tasks`,
    data,
  );
  return response.data;
}
