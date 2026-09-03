"use client";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateBoardDialog } from "@/features/boards/components/create-board-dialog";
import { BoardList } from "@/features/boards/components/board-list";
import { EmptyBoards } from "@/features/boards/components/empty-boards";
import { useBoards } from "@/features/boards/hooks/use-boards";

export default function BoardsPage() {
  const query = useBoards();
  return (
    <main className="min-h-screen bg-background px-6 py-10">
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
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
              <h2 className="font-semibold">
                We couldn&apos;t load your boards
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Please try again in a moment.
              </p>
              <Button
                className="mt-5"
                variant="outline"
                onClick={() => query.refetch()}
              >
                <RefreshCw />
                Retry
              </Button>
            </div>
          ) : !query.isLoading && query.data?.length === 0 ? (
            <EmptyBoards />
          ) : (
            <BoardList boards={query.data} isLoading={query.isLoading} />
          )}
        </section>
      </div>
    </main>
  );
}
