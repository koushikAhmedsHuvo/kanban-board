"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { moveColumn } from "../api/move-column";
import { COLUMN_KEYS } from "./use-columns";
import type { Column } from "../types/column.types";
export function useMoveColumn(boardId: string) { const client = useQueryClient(); return useMutation({ mutationFn: ({ columnId, targetPosition }: { columnId: string; targetPosition: number }) => moveColumn(columnId, targetPosition), onMutate: async ({ columnId, targetPosition }) => { await client.cancelQueries({ queryKey: COLUMN_KEYS.board(boardId) }); const key = COLUMN_KEYS.board(boardId); const previous = client.getQueryData<Column[]>(key); if (previous) { client.setQueryData(key, previous.map((column) => column.id === columnId ? { ...column, position: targetPosition } : column).sort((a, b) => a.position - b.position)); } return { previous }; }, onError: (_error, _variables, context) => { if (context?.previous) client.setQueryData(COLUMN_KEYS.board(boardId), context.previous); toast.error("Unable to reorder columns"); }, onSuccess: () => toast.success("Column order updated"), onSettled: () => client.invalidateQueries({ queryKey: COLUMN_KEYS.board(boardId) }) }); }
