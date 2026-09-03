import { apiClient } from "@/lib/axios";
import type { BoardMember } from "../types/member.types";
export async function getMembers(boardId: string) { const response = await apiClient.get<BoardMember[]>(`/boards/${boardId}/members`); return response.data; }
