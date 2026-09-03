"use client";

import { useEffect, useState } from "react";
import type { PresenceUser } from "../events";
import { useSocket } from "./use-socket";

export function usePresence() {
  const socket = useSocket();
  const [users, setUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!socket) return;
    const sync = (next: PresenceUser[] | { users?: PresenceUser[] }) =>
      setUsers(Array.isArray(next) ? next : (next.users ?? []));
    const joined = (user: PresenceUser) =>
      setUsers((current) =>
        current.some((item) => item.id === user.id)
          ? current
          : [...current, user],
      );
    const left = (user: PresenceUser) =>
      setUsers((current) => current.filter((item) => item.id !== user.id));
    socket.on("presence", sync);
    socket.on("user.joined", joined);
    socket.on("user.left", left);
    return () => {
      socket.off("presence", sync);
      socket.off("user.joined", joined);
      socket.off("user.left", left);
    };
  }, [socket]);

  return { users };
}
