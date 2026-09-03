import { apiClient } from "@/lib/axios";

export interface ActivityItem { id: string; action: string; actor: { id: string; name: string }; createdAt: string; task?: { id: string; title: string } | null; }
export interface ActivityPage { items: ActivityItem[]; nextCursor?: string | null; }

export async function getActivity(boardId: string, cursor?: string) {
  const response = await apiClient.get<ActivityPage>(`/boards/${boardId}/activity`, { params: cursor ? { cursor } : undefined });
  return response.data;
}