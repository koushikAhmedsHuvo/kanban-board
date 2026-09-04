"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { createBoard } from "../api/create-board";
import { BOARD_KEYS } from "./use-boards";
export function useCreateBoard() {
  const client = useQueryClient();
  return useMutation({
    onMutate: () => toastInfo("Creating Board..."),
    mutationFn: createBoard,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: BOARD_KEYS.all });
      toastSuccess("Board Created");
    },
    onError: () => toastError("Unable to create board"),
  });
}
