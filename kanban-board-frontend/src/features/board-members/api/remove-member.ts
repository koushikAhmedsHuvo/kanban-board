import { apiClient } from "@/lib/axios";
export async function removeMember(boardId: string, memberId: string) {
  const response = await apiClient.delete<{ message: string }>(
    `/boards/${boardId}/members/${memberId}`,
  );
  return response.data;
}
