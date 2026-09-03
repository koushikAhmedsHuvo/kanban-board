"use client";
import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../api/get-boards";
export const BOARD_KEYS = { all: ["boards"] as const, detail: (id: string) => ["boards", id] as const };
export function useBoards() { return useQuery({ queryKey: BOARD_KEYS.all, queryFn: getBoards, staleTime: 5 * 60_000 }); }
