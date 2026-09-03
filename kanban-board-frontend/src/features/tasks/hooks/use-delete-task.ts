"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTask } from "../api/delete-task";
import { TASK_KEYS } from "./use-column-tasks";
export function useDeleteTask(columnId: string) { const client = useQueryClient(); return useMutation({ mutationFn: deleteTask, onSuccess: () => { client.invalidateQueries({ queryKey: TASK_KEYS.column(columnId) }); toast.success("Task deleted"); }, onError: () => toast.error("Unable to delete task") }); }
