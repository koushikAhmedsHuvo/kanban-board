"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { BoardMember } from "../types/member.types";
import { RoleBadge } from "./role-badge";
import { UpdateRoleDialog } from "./update-role-dialog";
import { RemoveMemberDialog } from "./remove-member-dialog";
export function MemberCard({ member, boardId, canManage, currentUserId }: { member: BoardMember; boardId: string; canManage: boolean; currentUserId?: string }) { const isOwner = member.role === "OWNER"; const isSelfOwner = isOwner && member.user.id === currentUserId; const initials = member.user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); return <Card><CardContent className="flex items-center gap-4 p-4"><Avatar><AvatarFallback>{initials}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate font-medium">{member.user.name}</p><p className="truncate text-sm text-muted-foreground">{member.user.email}</p></div><RoleBadge role={member.role} />{canManage && !isOwner && !isSelfOwner && <div className="flex gap-1"><UpdateRoleDialog boardId={boardId} member={member} /><RemoveMemberDialog boardId={boardId} member={member} /></div>}</CardContent></Card>; }
