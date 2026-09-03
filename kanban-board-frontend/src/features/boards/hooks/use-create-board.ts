"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { createBoard } from "../api/create-board";
import { BOARD_KEYS } from "./use-boards";
export function useCreateBoard() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: BOARD_KEYS.all });
      toast.success("Board created");
    },
    onError: () => toast.error("Unable to create board"),
  });
}
