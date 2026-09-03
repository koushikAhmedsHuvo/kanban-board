import { apiClient } from "@/lib/axios";
import type { Column, RawColumn } from "../types/column.types";
export async function getColumns(boardId: string) { const response = await apiClient.get<RawColumn[]>(`/boards/${boardId}/columns`); return response.data.map((column): Column => ({ id: column.id, title: column.title, position: column.position, taskCount: column.taskCount ?? column._count?.tasks ?? 0 })); }
