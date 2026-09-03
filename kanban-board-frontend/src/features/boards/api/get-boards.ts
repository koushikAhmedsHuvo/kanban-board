import { apiClient } from "@/lib/axios";
import type { Board } from "../types/board.types";

export async function getBoards() {
  const response = await apiClient.get<Board[]>("/boards");
  return response.data;
}
