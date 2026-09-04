"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { deleteBoard } from "../api/delete-board";
import { BOARD_KEYS } from "./use-boards";
export function useDeleteBoard() {
  const client = useQueryClient();
  return useMutation({
    onMutate: () => toastInfo("Deleting Board..."),
    mutationFn: deleteBoard,
    onSuccess: (_, boardId) => {
      client.removeQueries({ queryKey: BOARD_KEYS.detail(boardId) });
      client.invalidateQueries({ queryKey: BOARD_KEYS.all });
      toastSuccess("Board Deleted");
    },
    onError: () => toastError("Unable to delete board"),
  });
}
