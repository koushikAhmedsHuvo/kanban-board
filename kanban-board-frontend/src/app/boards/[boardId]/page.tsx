"use client";
import * as React from "react";
import { InviteMemberDialog } from "@/features/board-members/components/invite-member-dialog";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useBoard } from "@/features/boards/hooks/use-board";
import { useColumns } from "@/features/columns/hooks/use-columns";
import { useMembers } from "@/features/board-members/hooks/use-members";
import { CreateColumnDialog } from "@/features/columns/components/create-column-dialog";
import { KanbanBoard } from "@/features/columns/components/kanban-board";
import { TaskSearch } from "@/features/search/task-search";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useSearchParams, useRouter } from "next/navigation";
import { SocketProvider } from "@/features/realtime/socket-provider";
import { BoardSidebar } from "@/features/boards/components/board-sidebar";
import { BoardStats } from "@/features/boards/components/board-stats";
import { NotificationCenter } from "@/features/notifications/notification-center";
export default function BoardPage({ params }: { params: { boardId: string } }) {
  const board = useBoard(params.boardId);
  const columns = useColumns(params.boardId);
  const members = useMembers(params.boardId);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState("");
  const columnFilter = searchParams.get("column") ?? "all";
  const isOwner = Boolean(
    board.data && user && board.data.owner.id === user.id,
  );
  const currentMember = members.data?.find(
    (member) => member.user.id === user?.id,
  );
  const canManage =
    currentMember?.role === "OWNER" || currentMember?.role === "EDITOR";
  React.useEffect(() => {
    const saved = window.localStorage.getItem(
      `board-${params.boardId}-column-filter`,
    );
    if (!searchParams.has("column") && saved)
      router.replace(`/boards/${params.boardId}?column=${saved}`);
  }, [params.boardId, router, searchParams]);
  function setFilter(value: string) {
    window.localStorage.setItem(`board-${params.boardId}-column-filter`, value);
    router.replace(
      value === "all"
        ? `/boards/${params.boardId}`
        : `/boards/${params.boardId}?column=${value}`,
    );
  }
  if (board.isLoading)
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="mt-8 h-64 w-full" />
      </main>
    );
  if (board.isError || !board.data)
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <h1 className="font-semibold">We couldn&apos;t load this board</h1>
          <Button
            className="mt-5"
            variant="outline"
            onClick={() => board.refetch()}
          >
            <RefreshCw />
            Retry
          </Button>
        </div>
      </main>
    );
  return (
    <SocketProvider boardId={params.boardId}>
      <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10">
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
              <NotificationCenter boardId={params.boardId} />
              <BoardSidebar boardId={params.boardId} />
              <Link href={`/boards/${params.boardId}/members`}>
                <Button variant="outline">Members</Button>
              </Link>
              {isOwner && <InviteMemberDialog boardId={params.boardId} />}
            </div>
          </header>
          <section className="pt-6">
            <BoardStats boardId={params.boardId} />
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
                {canManage && <CreateColumnDialog boardId={params.boardId} />}
              </div>
            </div>
            {columns.isError ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
                <p className="font-medium">
                  We couldn&apos;t load the columns.
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => columns.refetch()}
                >
                  <RefreshCw />
                  Retry
                </Button>
              </div>
            ) : (
              <KanbanBoard
                boardId={params.boardId}
                columns={columns.data}
                isLoading={columns.isLoading}
                canManage={canManage}
                search={search}
                columnFilter={columnFilter}
                emptyAction={
                  canManage ? (
                    <CreateColumnDialog boardId={params.boardId} />
                  ) : undefined
                }
              />
            )}
          </section>
        </div>
      </main>
    </SocketProvider>
  );
}
