import { io, type Socket } from "socket.io-client";
import { env } from "@/env";

export function createBoardSocket(token: string): Socket {
  return io(env.NEXT_PUBLIC_API_URL, {
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
    auth: { token },
  });
}
