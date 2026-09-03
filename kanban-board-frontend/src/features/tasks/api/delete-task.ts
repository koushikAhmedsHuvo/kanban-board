import { apiClient } from "@/lib/axios";
export async function deleteTask(taskId: string) {
  const response = await apiClient.delete<{ message: string }>(
    `/tasks/${taskId}`,
  );
  return response.data;
}
