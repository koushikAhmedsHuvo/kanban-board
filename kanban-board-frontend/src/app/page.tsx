import { KanbanSquare } from "lucide-react";

import { HomeCta } from "./home-cta";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <KanbanSquare className="size-7" />
        </div>
        <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Kanban Board
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Organize work clearly.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Create boards, manage your team, and move tasks from idea to done.
        </p>
        <HomeCta />
      </section>
    </main>
  );
}
