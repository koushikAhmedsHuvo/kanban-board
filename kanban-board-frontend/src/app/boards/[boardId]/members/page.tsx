"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { QueryError } from "@/components/error/query-error";
import { EmptyMembers } from "@/features/board-members/components/empty-members";
import { MembersList } from "@/features/board-members/components/members-list";
import { useMembers } from "@/features/board-members/hooks/use-members";
import { useBoard } from "@/features/boards/hooks/use-board";
import { useAuth } from "@/hooks/use-auth";
import { PermissionProvider } from "@/features/rbac/permission-provider";
import { Can } from "@/features/rbac/components/can";
import { AppNav } from "@/components/layout/app-nav";
import { useRouteParams } from "@/hooks/use-route-params";

const LazyInviteMemberDialog = dynamic(() =>
  import("@/features/board-members/components/invite-member-dialog").then(
    (module) => module.InviteMemberDialog,
  ),
);

export default function MembersPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = useRouteParams(params);
  const members = useMembers(boardId);
  const board = useBoard(boardId);
  const { user } = useAuth();
  const canManage =
    board.data?.role === "OWNER" || board.data?.owner.id === user?.id;

  return (
    <PermissionProvider role={board.data?.role}>
      <div className="min-h-screen md:flex">
        <AppNav />
        <main className="min-w-0 flex-1 bg-background px-4 py-6 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-4xl">
            <Link
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              href={`/boards/${boardId}`}
            >
              <ArrowLeft className="size-4" />
              Back to board
            </Link>
            <header className="mt-8 flex flex-wrap items-end justify-between gap-4 border-b pb-6">
              <div>
                <p className="text-sm text-muted-foreground">Board sharing</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  Members {members.data && `(${members.data.length})`}
                </h1>
              </div>
              <Can permission="MEMBER_INVITE">
                <LazyInviteMemberDialog boardId={boardId} />
              </Can>
            </header>
            <section className="pt-8">
              {members.isError ? (
                <QueryError
                  message="We couldn't load members."
                  onRetry={members.refetch}
                />
              ) : !members.isLoading && members.data?.length === 0 ? (
                <EmptyMembers />
              ) : (
                <MembersList
                  members={members.data}
                  isLoading={members.isLoading}
                  boardId={boardId}
                  canManage={canManage}
                  currentUserId={user?.id}
                />
              )}
            </section>
          </div>
        </main>
      </div>
    </PermissionProvider>
  );
}
