"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/features/realtime/hooks/use-socket";
import { toast } from "@/lib/toast";

export interface NotificationItem {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}
export const NOTIFICATION_KEYS = {
  board: (boardId: string) => ["notifications", boardId] as const,
};

export function NotificationCenter({ boardId }: { boardId: string }) {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: NOTIFICATION_KEYS.board(boardId),
    queryFn: async () => [] as NotificationItem[],
    initialData: [] as NotificationItem[],
  });
  useEffect(() => {
    if (!socket) return;
    const onNotification = (
      payload: Partial<NotificationItem> & {
        message?: string;
        data?: Partial<NotificationItem>;
      },
    ) => {
      const next = payload.data ?? payload;
      const notification = {
        id: next.id ?? crypto.randomUUID(),
        message: next.message ?? "Board updated",
        read: false,
        createdAt: next.createdAt ?? new Date().toISOString(),
      };
      queryClient.setQueryData<NotificationItem[]>(
        NOTIFICATION_KEYS.board(boardId),
        (current = []) => [notification, ...current].slice(0, 30),
      );
      toast.info(notification.message);
    };
    ["board.shared", "task.created", "task.updated", "member.invited"].forEach(
      (event) => socket.on(event, onNotification),
    );
    return () =>
      [
        "board.shared",
        "task.created",
        "task.updated",
        "member.invited",
      ].forEach((event) => socket.off(event, onNotification));
  }, [boardId, queryClient, socket]);
  const unread = items.filter((item) => !item.read).length;
  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium">
        <Bell className="size-4" />
        Notifications
        {unread > 0 && (
          <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
            {unread}
          </span>
        )}
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border bg-background p-3 shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold">Notifications</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              queryClient.setQueryData<NotificationItem[]>(
                NOTIFICATION_KEYS.board(boardId),
                items.map((item) => ({ ...item, read: true })),
              )
            }
          >
            <CheckCheck /> Mark all read
          </Button>
        </div>
        {items.length ? (
          items.map((item) => (
            <button
              className="block w-full border-t px-1 py-3 text-left text-sm hover:bg-muted"
              key={item.id}
              onClick={() =>
                queryClient.setQueryData<NotificationItem[]>(
                  NOTIFICATION_KEYS.board(boardId),
                  items.map((entry) =>
                    entry.id === item.id ? { ...entry, read: true } : entry,
                  ),
                )
              }
            >
              {item.message}
              <span className="block text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </button>
          ))
        ) : (
          <p className="border-t pt-3 text-sm text-muted-foreground">
            You&apos;re all caught up.
          </p>
        )}
      </div>
    </details>
  );
}
