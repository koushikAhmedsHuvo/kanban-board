"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateColumn } from "../api/update-column";
import { COLUMN_KEYS } from "./use-columns";
export function useUpdateColumn(boardId: string) { const client = useQueryClient(); return useMutation({ mutationFn: ({ columnId, title }: { columnId: string; title: string }) => updateColumn(columnId, { title }), onSuccess: () => { client.invalidateQueries({ queryKey: COLUMN_KEYS.board(boardId) }); toast.success("Column updated"); }, onError: () => toast.error("Unable to update column") }); }
