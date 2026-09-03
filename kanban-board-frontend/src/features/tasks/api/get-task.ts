import { apiClient } from "@/lib/axios";
import type { TaskDetails } from "../types/task.types";
export async function getTask(taskId: string) { const response = await apiClient.get<TaskDetails>(`/tasks/${taskId}`); return response.data; }
