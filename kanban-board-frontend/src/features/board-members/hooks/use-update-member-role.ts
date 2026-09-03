"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { updateMemberRole } from "../api/update-member-role";
import { MEMBER_KEYS } from "./use-members";
export function useUpdateMemberRole(boardId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: "EDITOR" | "VIEWER";
    }) => updateMemberRole(boardId, memberId, role),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: MEMBER_KEYS.board(boardId) });
      toast.success("Member role updated");
    },
    onError: () => toast.error("Unable to update member role"),
  });
}
