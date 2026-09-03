"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getActivity } from "../api/get-activity";

export const ACTIVITY_KEYS = { board: (boardId: string) => ["activity", boardId] as const };
export function useActivity(boardId: string) {
  return useInfiniteQuery({ queryKey: ACTIVITY_KEYS.board(boardId), queryFn: ({ pageParam }) => getActivity(boardId, pageParam), initialPageParam: undefined as string | undefined, getNextPageParam: (page) => page.nextCursor ?? undefined, enabled: Boolean(boardId) });
}