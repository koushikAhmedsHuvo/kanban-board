"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { updateMemberRole } from "../api/update-member-role";
import { MEMBER_KEYS } from "./use-members";
export function useUpdateMemberRole(boardId: string) {
  const client = useQueryClient();
  return useMutation({
    onMutate: () => toastInfo("Updating member role..."),
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: "EDITOR" | "VIEWER";
    }) => updateMemberRole(boardId, memberId, role),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: MEMBER_KEYS.board(boardId) });
      toastSuccess("Member role updated");
    },
    onError: () => toastError("Unable to update member role"),
  });
}
