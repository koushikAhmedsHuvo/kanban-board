"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/loading/page-skeleton";
import { QueryError } from "@/components/error/query-error";
import { useAuth } from "@/hooks/use-auth";
import { useBoard } from "@/features/boards/hooks/use-board";
import { useColumns } from "@/features/columns/hooks/use-columns";
import { useMembers } from "@/features/board-members/hooks/use-members";
import { CreateColumnDialog } from "@/features/columns/components/create-column-dialog";
import { KanbanBoard } from "@/features/columns/components/kanban-board";
import { TaskSearch } from "@/features/search/task-search";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useSearchParams, useRouter } from "next/navigation";
import { BoardSidebar } from "@/features/boards/components/board-sidebar";
import { BoardStats } from "@/features/boards/components/board-stats";
import { UpdateBoardDialog } from "@/features/boards/components/update-board-dialog";
import { DeleteBoardDialog } from "@/features/boards/components/delete-board-dialog";
import { PermissionProvider } from "@/features/rbac/permission-provider";
import { Can } from "@/features/rbac/components/can";
import { AppNav } from "@/components/layout/app-nav";
import { useRouteParams } from "@/hooks/use-route-params";

const LazyInviteMemberDialog = dynamic(() =>
  import("@/features/board-members/components/invite-member-dialog").then(
    (module) => module.InviteMemberDialog,
  ),
);

export default function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = useRouteParams(params);
  const board = useBoard(boardId);
  const columns = useColumns(boardId);
  const members = useMembers(boardId);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState("");
  const columnFilter = searchParams.get("column") ?? "all";
  const currentMember = members.data?.find(
    (member) => member.user.id === user?.id,
  );
  const canManage =
    currentMember?.role === "OWNER" ||
    currentMember?.role === "EDITOR" ||
    board.data?.role === "OWNER" ||
    board.data?.role === "EDITOR";

  React.useEffect(() => {
    const saved = window.localStorage.getItem(`board-${boardId}-column-filter`);
    if (!searchParams.has("column") && saved)
      router.replace(`/boards/${boardId}?column=${saved}`);
  }, [boardId, router, searchParams]);

  function setFilter(value: string) {
    window.localStorage.setItem(`board-${boardId}-column-filter`, value);
    router.replace(
      value === "all"
        ? `/boards/${boardId}`
        : `/boards/${boardId}?column=${value}`,
    );
  }

  if (board.isLoading) return <PageSkeleton />;
  if (board.isError || !board.data)
    return (
      <QueryError
        message="We couldn't load this board."
        onRetry={board.refetch}
      />
    );

  return (
    <PermissionProvider role={board.data.role}>
      <div className="min-h-screen md:flex">
        <AppNav />
        <main className="min-w-0 flex-1 bg-background px-4 py-6 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <Link
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                href="/boards"
              >
                <ArrowLeft className="size-4" />
                Back to boards
              </Link>
              <ThemeToggle />
            </div>
            <header className="mt-8 flex flex-wrap items-end justify-between gap-5 border-b pb-6">
              <div>
                <p className="text-sm text-muted-foreground">Board workspace</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  {board.data.name}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {board.data.memberCount} members
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Can permission="BOARD_UPDATE">
                  <UpdateBoardDialog
                    boardId={boardId}
                    currentName={board.data.name}
                  />
                </Can>
                <Can permission="BOARD_DELETE">
                  <DeleteBoardDialog boardId={boardId} />
                </Can>
                <BoardSidebar />
                <Link href={`/boards/${boardId}/members`}>
                  <Button variant="outline">Members</Button>
                </Link>
                <Can permission="MEMBER_INVITE">
                  <LazyInviteMemberDialog boardId={boardId} />
                </Can>
              </div>
            </header>
            <section className="pt-6">
              <BoardStats boardId={boardId} />
            </section>
            <section className="pt-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Columns</h2>
                <div className="flex flex-wrap gap-2">
                  <TaskSearch value={search} onChange={setSearch} />
                  <select
                    aria-label="Filter tasks by column"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
                    value={columnFilter}
                    onChange={(event) => setFilter(event.target.value)}
                  >
                    <option value="all">All Tasks</option>
                    {columns.data?.map((column) => (
                      <option key={column.id} value={column.id}>
                        {column.title}
                      </option>
                    ))}
                  </select>
                  <Can permission="COLUMN_CREATE">
                    <CreateColumnDialog boardId={boardId} />
                  </Can>
                </div>
              </div>
              {columns.isError ? (
                <QueryError
                  message="We couldn't load the columns."
                  onRetry={columns.refetch}
                />
              ) : (
                <KanbanBoard
                  boardId={boardId}
                  columns={columns.data}
                  isLoading={columns.isLoading}
                  canManage={canManage}
                  search={search}
                  columnFilter={columnFilter}
                  emptyAction={
                    <Can permission="COLUMN_CREATE">
                      <CreateColumnDialog boardId={boardId} />
                    </Can>
                  }
                />
              )}
            </section>
          </div>
        </main>
      </div>
    </PermissionProvider>
  );
}
