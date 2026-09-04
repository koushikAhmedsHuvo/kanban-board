"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { removeMember } from "../api/remove-member";
import { MEMBER_KEYS } from "./use-members";
export function useRemoveMember(boardId: string) {
  const client = useQueryClient();
  return useMutation({
    onMutate: () => toastInfo("Removing member..."),
    mutationFn: (memberId: string) => removeMember(boardId, memberId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: MEMBER_KEYS.board(boardId) });
      toastSuccess("Member removed");
    },
    onError: () => toastError("Unable to remove member"),
  });
}
