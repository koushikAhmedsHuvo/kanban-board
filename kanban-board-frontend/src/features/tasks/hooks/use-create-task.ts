"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTask } from "../api/create-task";
import { TASK_KEYS } from "./use-column-tasks";
export function useCreateTask(columnId: string) { const client = useQueryClient(); return useMutation({ mutationFn: (data: { title: string; description?: string }) => createTask(columnId, data), onSuccess: () => { client.invalidateQueries({ queryKey: TASK_KEYS.column(columnId) }); toast.success("Task created"); }, onError: () => toast.error("Unable to create task") }); }
