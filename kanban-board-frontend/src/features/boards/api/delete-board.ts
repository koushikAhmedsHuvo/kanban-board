import { apiClient } from "@/lib/axios";
import type { DeleteBoardResponse } from "../types/board.types";

export async function deleteBoard(boardId: string) {
  const response = await apiClient.delete<DeleteBoardResponse>(`/boards/${boardId}`);
  return response.data;
}
