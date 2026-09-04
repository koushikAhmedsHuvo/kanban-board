"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { createColumn } from "../api/create-column";
import { COLUMN_KEYS } from "./use-columns";
export function useCreateColumn(boardId: string) {
  const client = useQueryClient();
  return useMutation({
    onMutate: () => toastInfo("Creating Column..."),
    mutationFn: (data: { title: string }) => createColumn(boardId, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: COLUMN_KEYS.board(boardId) });
      toastSuccess("Column Created");
    },
    onError: () => toastError("Unable to create column"),
  });
}
