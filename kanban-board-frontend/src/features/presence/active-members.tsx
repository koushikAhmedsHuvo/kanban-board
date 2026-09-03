"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMembers } from "@/features/board-members/hooks/use-members";
import { usePresence } from "@/features/realtime/hooks/use-presence";
import { MemberPresenceBadge } from "./member-presence-badge";

export function ActiveMembers({ boardId }: { boardId: string }) {
  const { data: members = [] } = useMembers(boardId);
  const { users } = usePresence();
  const activeIds = new Set(users.map((user) => user.id));
  const activeMembers = members.filter((member) => activeIds.has(member.user.id));
  return <div className="space-y-3"><div className="flex -space-x-2">{activeMembers.slice(0, 5).map((member) => <Avatar key={member.id} className="ring-2 ring-background"><AvatarFallback>{member.user.name.slice(0, 1).toUpperCase()}</AvatarFallback></Avatar>)}{activeMembers.length > 5 && <span className="ml-3 self-center text-xs text-muted-foreground">+{activeMembers.length - 5}</span>}</div><div className="space-y-2">{activeMembers.map((member) => <div className="flex items-center justify-between gap-3" key={member.id}><span className="truncate text-sm">{member.user.name}</span><MemberPresenceBadge online /></div>)}{!activeMembers.length && <MemberPresenceBadge online={false} name="No collaborators" />}</div></div>;
}