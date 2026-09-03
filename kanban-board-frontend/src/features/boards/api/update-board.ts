import { apiClient } from "@/lib/axios";
import type { Board, UpdateBoardRequest } from "../types/board.types";

export async function updateBoard(boardId: string, data: UpdateBoardRequest) {
  const response = await apiClient.patch<Board>(`/boards/${boardId}`, data);
  return response.data;
}
