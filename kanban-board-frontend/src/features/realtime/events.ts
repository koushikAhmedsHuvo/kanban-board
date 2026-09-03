import type { BoardMember } from "@/features/board-members/types/member.types";
import type { Column } from "@/features/columns/types/column.types";
import type { Task } from "@/features/tasks/types/task.types";

export const REALTIME_EVENTS = [
  "task.created",
  "task.updated",
  "task.deleted",
  "task.moved",
  "column.created",
  "column.updated",
  "column.deleted",
  "column.moved",
  "user.joined",
  "user.left",
  "task.editing.start",
  "task.editing.stop",
  "board.shared",
  "member.invited",
] as const;

export type RealtimeTask = Task & {
  boardId?: string;
  columnId?: string;
  targetColumnId?: string;
};
export type RealtimeColumn = Column & { boardId?: string };
export type PresenceUser = Pick<BoardMember["user"], "id" | "name">;
export type RealtimePayload<T> = T & {
  data?: T;
  user?: PresenceUser;
  taskId?: string;
};

export function unwrapPayload<T>(payload: T | { data?: T }): T {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data
  )
    return payload.data;
  return payload as T;
}
