"use client";

import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { useAuthStore } from "@/store/auth.store";
import { createBoardSocket } from "./socket";
import { SocketContext } from "./hooks/use-socket";
import { useBoardEvents } from "./hooks/use-board-events";

export function SocketProvider({
  boardId,
  children,
}: {
  boardId: string;
  children: React.ReactNode;
}) {
  const token = useAuthStore((state) => state.token);
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    if (!token || !boardId) return;
    const nextSocket = createBoardSocket(token);
    nextSocket.emit("join", `board:${boardId}`);
    setSocket(nextSocket);
    return () => {
      nextSocket.emit("leave", `board:${boardId}`);
      nextSocket.disconnect();
      setSocket(null);
    };
  }, [boardId, token]);
  return (
    <SocketContext.Provider value={socket}>
      <BoardEventBridge boardId={boardId} />
      {children}
    </SocketContext.Provider>
  );
}

function BoardEventBridge({ boardId }: { boardId: string }) {
  useBoardEvents(boardId);
  return null;
}
