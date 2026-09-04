"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { moveColumn } from "../api/move-column";
import { COLUMN_KEYS } from "./use-columns";
import type { Column } from "../types/column.types";
export function useMoveColumn(boardId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      columnId,
      targetPosition,
    }: {
      columnId: string;
      targetPosition: number;
    }) => moveColumn(columnId, targetPosition),
    onMutate: async ({ columnId, targetPosition }) => {
      toastInfo("Moving Column...");
      await client.cancelQueries({ queryKey: COLUMN_KEYS.board(boardId) });
      const key = COLUMN_KEYS.board(boardId);
      const previous = client.getQueryData<Column[]>(key);
      if (previous) {
        client.setQueryData(
          key,
          previous
            .map((column) =>
              column.id === columnId
                ? { ...column, position: targetPosition }
                : column,
            )
            .sort((a, b) => a.position - b.position),
        );
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous)
        client.setQueryData(COLUMN_KEYS.board(boardId), context.previous);
      toastError("Unable to reorder columns");
    },
    onSuccess: () => toastSuccess("Column order updated"),
    onSettled: () =>
      client.invalidateQueries({ queryKey: COLUMN_KEYS.board(boardId) }),
  });
}
