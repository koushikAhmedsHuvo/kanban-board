"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { inviteMember } from "../api/invite-member";
import { MEMBER_KEYS } from "./use-members";
export function useInviteMember(boardId: string) {
  const client = useQueryClient();
  return useMutation({
    onMutate: () => toastInfo("Inviting member..."),
    mutationFn: (data: Parameters<typeof inviteMember>[1]) =>
      inviteMember(boardId, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: MEMBER_KEYS.board(boardId) });
      toastSuccess("Member invited");
    },
    onError: (error) =>
      toastError(
        error instanceof Error ? error.message : "Unable to invite member",
      ),
  });
}
