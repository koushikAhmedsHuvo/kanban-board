"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { removeMember } from "../api/remove-member";
import { MEMBER_KEYS } from "./use-members";
export function useRemoveMember(boardId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => removeMember(boardId, memberId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: MEMBER_KEYS.board(boardId) });
      toast.success("Member removed");
    },
    onError: () => toast.error("Unable to remove member"),
  });
}
