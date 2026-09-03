"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { createColumn } from "../api/create-column";
import { COLUMN_KEYS } from "./use-columns";
export function useCreateColumn(boardId: string) { const client = useQueryClient(); return useMutation({ mutationFn: (data: { title: string }) => createColumn(boardId, data), onSuccess: () => { client.invalidateQueries({ queryKey: COLUMN_KEYS.board(boardId) }); toast.success("Column created"); }, onError: () => toast.error("Unable to create column") }); }
