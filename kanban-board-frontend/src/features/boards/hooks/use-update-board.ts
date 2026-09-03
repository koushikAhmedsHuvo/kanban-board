"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { updateBoard } from "../api/update-board";
import { BOARD_KEYS } from "./use-boards";
export function useUpdateBoard() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, name }: { boardId: string; name: string }) =>
      updateBoard(boardId, { name }),
    onSuccess: (data) => {
      client.setQueryData(BOARD_KEYS.detail(data.id), data);
      client.invalidateQueries({ queryKey: BOARD_KEYS.all });
      toast.success("Board updated");
    },
    onError: () => toast.error("Unable to update board"),
  });
}
