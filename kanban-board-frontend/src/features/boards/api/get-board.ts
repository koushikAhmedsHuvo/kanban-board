import { apiClient } from "@/lib/axios";
import type { BoardDetails } from "../types/board.types";

export async function getBoard(boardId: string) {
  const response = await apiClient.get<BoardDetails>(`/boards/${boardId}`);
  return response.data;
}
