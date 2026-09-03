import { Skeleton } from "@/components/ui/skeleton";
import type { BoardMember } from "../types/member.types";
import { MemberCard } from "./member-card";
const rank = { OWNER: 0, EDITOR: 1, VIEWER: 2 };
export function MembersList({ members, isLoading, boardId, canManage, currentUserId }: { members?: BoardMember[]; isLoading: boolean; boardId: string; canManage: boolean; currentUserId?: string }) { if (isLoading) return <div className="grid gap-3">{[1, 2, 3].map((item) => <Skeleton className="h-20" key={item} />)}</div>; return <div className="grid gap-3">{[...(members ?? [])].sort((a, b) => rank[a.role] - rank[b.role]).map((member) => <MemberCard key={member.id} member={member} boardId={boardId} canManage={canManage} currentUserId={currentUserId} />)}</div>; }
