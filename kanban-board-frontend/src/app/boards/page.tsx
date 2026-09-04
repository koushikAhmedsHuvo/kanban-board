"use client";
import { QueryError } from "@/components/error/query-error";
import { CreateBoardDialog } from "@/features/boards/components/create-board-dialog";
import { BoardList } from "@/features/boards/components/board-list";
import { EmptyBoards } from "@/features/boards/components/empty-boards";
import { useBoards } from "@/features/boards/hooks/use-boards";
import { AppNav } from "@/components/layout/app-nav";

export default function BoardsPage() {
  const query = useBoards();
  return (
    <div className="min-h-screen md:flex">
      <AppNav />
      <main className="min-w-0 flex-1 bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              My Boards
            </h1>
          </div>
          <CreateBoardDialog />
        </header>
        <section className="pt-8">
          {query.isError ? (
            <QueryError message="We couldn't load your boards." onRetry={query.refetch} />
          ) : !query.isLoading && query.data?.length === 0 ? (
            <EmptyBoards />
          ) : (
            <BoardList boards={query.data} isLoading={query.isLoading} />
          )}
        </section>
      </div>
      </main>
    </div>
  );
}
