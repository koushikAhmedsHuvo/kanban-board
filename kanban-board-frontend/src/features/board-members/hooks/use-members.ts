"use client";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "../api/get-members";
export const MEMBER_KEYS = {
  all: ["members"] as const,
  board: (boardId: string) => ["members", boardId] as const,
};
export function useMembers(boardId: string) {
  return useQuery({
    queryKey: MEMBER_KEYS.board(boardId),
    queryFn: () => getMembers(boardId),
    enabled: Boolean(boardId),
  });
}
