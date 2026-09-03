"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteBoard } from "../api/delete-board";
import { BOARD_KEYS } from "./use-boards";
export function useDeleteBoard() { const client = useQueryClient(); return useMutation({ mutationFn: deleteBoard, onSuccess: (_, boardId) => { client.removeQueries({ queryKey: BOARD_KEYS.detail(boardId) }); client.invalidateQueries({ queryKey: BOARD_KEYS.all }); toast.success("Board deleted"); }, onError: () => toast.error("Unable to delete board") }); }
