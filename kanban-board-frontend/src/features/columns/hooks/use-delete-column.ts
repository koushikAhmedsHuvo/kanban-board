"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { deleteColumn } from "../api/delete-column";
import { COLUMN_KEYS } from "./use-columns";
export function useDeleteColumn(boardId: string) {
  const client = useQueryClient();
  return useMutation({
    onMutate: () => toastInfo("Deleting Column..."),
    mutationFn: deleteColumn,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: COLUMN_KEYS.board(boardId) });
      toastSuccess("Column Deleted");
    },
    onError: () => toastError("Cannot delete non-empty column"),
  });
}
