"use client";
import { useQuery } from "@tanstack/react-query";
import { getColumns } from "../api/get-columns";
export const COLUMN_KEYS = { board: (boardId: string) => ["columns", boardId] as const };
export function useColumns(boardId: string) { return useQuery({ queryKey: COLUMN_KEYS.board(boardId), queryFn: () => getColumns(boardId), enabled: Boolean(boardId) }); }
