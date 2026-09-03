import { apiClient } from "@/lib/axios";
import type { Column, UpdateColumnRequest } from "../types/column.types";
export async function updateColumn(
  columnId: string,
  data: UpdateColumnRequest,
) {
  const response = await apiClient.patch<Column>(`/columns/${columnId}`, data);
  return response.data;
}
