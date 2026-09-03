"use client";
import { useQuery } from "@tanstack/react-query";
import { getTask } from "../api/get-task";
import { TASK_KEYS } from "./use-column-tasks";
export function useTask(taskId?: string) { return useQuery({ queryKey: TASK_KEYS.task(taskId ?? ""), queryFn: () => getTask(taskId ?? ""), enabled: Boolean(taskId) }); }
