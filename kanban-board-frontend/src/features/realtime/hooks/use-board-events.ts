"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BOARD_KEYS } from "@/features/boards/hooks/use-boards";
import { COLUMN_KEYS } from "@/features/columns/hooks/use-columns";
import { MEMBER_KEYS } from "@/features/board-members/hooks/use-members";
import { TASK_KEYS } from "@/features/tasks/hooks/use-column-tasks";
import type { Column } from "@/features/columns/types/column.types";
import type { Task } from "@/features/tasks/types/task.types";
import type { RealtimeColumn, RealtimeTask } from "../events";
import { unwrapPayload } from "../events";
import { useSocket } from "./use-socket";

function entity<T>(payload: T | { data?: T }) {
  return unwrapPayload(payload);
}

export function useBoardEvents(boardId: string) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !boardId) return;
    const updateTask = (payload: RealtimeTask | { data?: RealtimeTask }) => {
      const task = entity(payload);
      if (!task?.id) return;
      queryClient.setQueriesData<Task[]>({ queryKey: ["tasks"] }, (tasks) =>
        tasks?.map((item) =>
          item.id === task.id ? { ...item, ...task } : item,
        ),
      );
      queryClient.setQueryData(
        TASK_KEYS.task(task.id),
        (current: Task | undefined) => ({ ...current, ...task }),
      );
    };
    const createTask = (payload: RealtimeTask | { data?: RealtimeTask }) => {
      const task = entity(payload);
      if (!task?.id || !task.columnId) return;
      queryClient.setQueryData<Task[]>(
        TASK_KEYS.column(task.columnId),
        (tasks = []) =>
          tasks.some((item) => item.id === task.id) ? tasks : [...tasks, task],
      );
    };
    const deleteTask = (payload: RealtimeTask | { data?: RealtimeTask }) => {
      const task = entity(payload);
      const taskId = task?.id ?? (payload as { taskId?: string }).taskId;
      if (!taskId) return;
      queryClient.setQueriesData<Task[]>({ queryKey: ["tasks"] }, (tasks) =>
        tasks?.filter((item) => item.id !== taskId),
      );
      queryClient.removeQueries({ queryKey: TASK_KEYS.task(taskId) });
    };
    const moveTask = (payload: RealtimeTask | { data?: RealtimeTask }) => {
      const task = entity(payload);
      if (!task?.id || !task.targetColumnId) return;
      deleteTask(task);
      createTask({ ...task, columnId: task.targetColumnId });
    };
    const updateColumn = (
      payload: RealtimeColumn | { data?: RealtimeColumn },
    ) => {
      const column = entity(payload);
      if (!column?.id) return;
      queryClient.setQueryData<Column[]>(
        COLUMN_KEYS.board(boardId),
        (columns = []) =>
          columns.some((item) => item.id === column.id)
            ? columns.map((item) =>
                item.id === column.id ? { ...item, ...column } : item,
              )
            : [...columns, column],
      );
    };
    const deleteColumn = (
      payload: RealtimeColumn | { data?: RealtimeColumn },
    ) => {
      const column = entity(payload);
      if (!column?.id) return;
      queryClient.setQueryData<Column[]>(
        COLUMN_KEYS.board(boardId),
        (columns = []) => columns.filter((item) => item.id !== column.id),
      );
      queryClient.removeQueries({ queryKey: TASK_KEYS.column(column.id) });
    };
    const refreshBoard = () =>
      queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(boardId) });
    socket.on("task.created", createTask);
    socket.on("task.updated", updateTask);
    socket.on("task.deleted", deleteTask);
    socket.on("task.moved", moveTask);
    socket.on("column.created", updateColumn);
    socket.on("column.updated", updateColumn);
    socket.on("column.moved", updateColumn);
    socket.on("column.deleted", deleteColumn);
    socket.on("member.invited", () =>
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.board(boardId) }),
    );
    socket.on("board.shared", refreshBoard);
    return () => {
      [
        "task.created",
        "task.updated",
        "task.deleted",
        "task.moved",
        "column.created",
        "column.updated",
        "column.moved",
        "column.deleted",
      ].forEach((event) => socket.off(event));
      socket.off("member.invited");
      socket.off("board.shared", refreshBoard);
    };
  }, [boardId, queryClient, socket]);
}
