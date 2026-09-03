import { apiClient } from "@/lib/axios";
import type { BoardMember, InviteMemberRequest } from "../types/member.types";
export async function inviteMember(boardId: string, data: InviteMemberRequest) {
  const users = await apiClient.get<Array<{ id: string; email: string }>>(
    `/boards/${boardId}/available-users`,
    { params: { q: data.email } },
  );
  const user = users.data.find(
    (candidate) => candidate.email.toLowerCase() === data.email.toLowerCase(),
  );
  if (!user) throw new Error("No available user found with this email");
  const response = await apiClient.post<BoardMember>(
    `/boards/${boardId}/members`,
    { userId: user.id, role: data.role },
  );
  return response.data;
}
