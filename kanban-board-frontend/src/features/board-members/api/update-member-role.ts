import { apiClient } from "@/lib/axios";
import type { BoardMember, ManageableRole } from "../types/member.types";
export async function updateMemberRole(
  boardId: string,
  memberId: string,
  role: ManageableRole,
) {
  const response = await apiClient.patch<BoardMember>(
    `/boards/${boardId}/members/${memberId}`,
    { role },
  );
  return response.data;
}
