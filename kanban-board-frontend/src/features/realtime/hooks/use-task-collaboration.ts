"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { useAuthStore } from "@/store/auth.store";
import { TASK_KEYS } from "@/features/tasks/hooks/use-column-tasks";
import { useSocket } from "./use-socket";

export function useTaskCollaboration(taskId: string, active: boolean) {
  const socket = useSocket();
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();
  const [editingUsers, setEditingUsers] = useState<string[]>([]);
  useEffect(() => {
    if (!socket || !taskId) return;
    const readTaskId = (payload: { taskId?: string; id?: string; user?: { id?: string; name?: string }; data?: { taskId?: string; id?: string; user?: { id?: string; name?: string } } }) => payload.data ?? payload;
    const onStart = (payload: Parameters<typeof readTaskId>[0]) => { const next = readTaskId(payload); if (next.taskId !== taskId && next.id !== taskId) return; const name = next.user?.name ?? "Someone"; setEditingUsers((current) => current.includes(name) ? current : [...current, name]); };
    const onStop = (payload: Parameters<typeof readTaskId>[0]) => { const next = readTaskId(payload); if (next.taskId === taskId || next.id === taskId) setEditingUsers([]); };
    const onUpdated = (payload: Parameters<typeof readTaskId>[0]) => { const next = readTaskId(payload); if ((next.taskId === taskId || next.id === taskId) && next.user?.id !== userId) { toast.warning("Task was updated by another user."); queryClient.invalidateQueries({ queryKey: TASK_KEYS.task(taskId) }); } };
    socket.on("task.editing.start", onStart);
    socket.on("task.editing.stop", onStop);
    socket.on("task.updated", onUpdated);
    if (active) socket.emit("task.editing.start", { taskId });
    return () => { if (active) socket.emit("task.editing.stop", { taskId }); socket.off("task.editing.start", onStart); socket.off("task.editing.stop", onStop); socket.off("task.updated", onUpdated); };
  }, [active, queryClient, socket, taskId, userId]);
  return { editingUsers };
}