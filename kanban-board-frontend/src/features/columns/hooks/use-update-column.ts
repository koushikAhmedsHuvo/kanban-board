"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { updateColumn } from "../api/update-column";
import { COLUMN_KEYS } from "./use-columns";
export function useUpdateColumn(boardId: string) {
  const client = useQueryClient();
  return useMutation({
    onMutate: () => toastInfo("Updating Column..."),
    mutationFn: ({ columnId, title }: { columnId: string; title: string }) =>
      updateColumn(columnId, { title }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: COLUMN_KEYS.board(boardId) });
      toastSuccess("Column Updated");
    },
    onError: () => toastError("Unable to update column"),
  });
}
