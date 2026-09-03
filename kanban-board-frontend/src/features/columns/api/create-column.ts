import { apiClient } from "@/lib/axios";
import type { Column, CreateColumnRequest } from "../types/column.types";
export async function createColumn(boardId: string, data: CreateColumnRequest) {
  const response = await apiClient.post<Column>(
    `/boards/${boardId}/columns`,
    data,
  );
  return response.data;
}
