import { apiClient } from "@/lib/axios";
export async function deleteColumn(columnId: string) { const response = await apiClient.delete<{ message: string }>(`/columns/${columnId}`); return response.data; }
