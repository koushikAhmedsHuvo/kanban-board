import { apiClient } from "@/lib/axios";
import type { Board, CreateBoardRequest } from "../types/board.types";

export async function createBoard(data: CreateBoardRequest) {
  const response = await apiClient.post<Board>("/boards", data);
  return response.data;
}
