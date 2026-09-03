"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteColumn } from "../api/delete-column";
import { COLUMN_KEYS } from "./use-columns";
export function useDeleteColumn(boardId: string) { const client = useQueryClient(); return useMutation({ mutationFn: deleteColumn, onSuccess: () => { client.invalidateQueries({ queryKey: COLUMN_KEYS.board(boardId) }); toast.success("Column deleted"); }, onError: () => toast.error("Cannot delete non-empty column") }); }
