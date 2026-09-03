"use client";
import { useQuery } from "@tanstack/react-query";
import { getBoard } from "../api/get-board";
import { BOARD_KEYS } from "./use-boards";
export function useBoard(boardId: string) { return useQuery({ queryKey: BOARD_KEYS.detail(boardId), queryFn: () => getBoard(boardId), enabled: Boolean(boardId) }); }
