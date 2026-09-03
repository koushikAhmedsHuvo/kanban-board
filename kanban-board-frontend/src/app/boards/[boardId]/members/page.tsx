"use client";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyMembers } from "@/features/board-members/components/empty-members";
import { InviteMemberDialog } from "@/features/board-members/components/invite-member-dialog";
import { MembersList } from "@/features/board-members/components/members-list";
import { useMembers } from "@/features/board-members/hooks/use-members";
import { useBoard } from "@/features/boards/hooks/use-board";
import { useAuth } from "@/hooks/use-auth";
export default function MembersPage({ params }: { params: { boardId: string } }) { const members = useMembers(params.boardId); const board = useBoard(params.boardId); const { user } = useAuth(); const canManage = board.data?.owner.id === user?.id; return <main className="min-h-screen bg-background px-6 py-10"><div className="mx-auto max-w-4xl"><Link className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" href={`/boards/${params.boardId}`}><ArrowLeft className="size-4" />Back to board</Link><header className="mt-8 flex flex-wrap items-end justify-between gap-4 border-b pb-6"><div><p className="text-sm text-muted-foreground">Board sharing</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Members {members.data && `(${members.data.length})`}</h1></div>{canManage && <InviteMemberDialog boardId={params.boardId} />}</header><section className="pt-8">{members.isError ? <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center"><h2 className="font-semibold">We couldn&apos;t load members</h2><Button className="mt-5" variant="outline" onClick={() => members.refetch()}><RefreshCw />Retry</Button></div> : !members.isLoading && members.data?.length === 0 ? <EmptyMembers /> : <MembersList members={members.data} isLoading={members.isLoading} boardId={params.boardId} canManage={canManage} currentUserId={user?.id} />}</section></div></main>; }
