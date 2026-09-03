import { apiClient } from "@/lib/axios";
export async function moveColumn(columnId: string, targetPosition: number) { const response = await apiClient.post<{ message: string }>(`/columns/${columnId}/move`, { targetPosition }); return response.data; }
