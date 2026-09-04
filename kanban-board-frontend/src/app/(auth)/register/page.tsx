import Link from "next/link";

import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Kanban Board
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Set up your workspace access in a moment.
          </p>
          <p className="text-sm">
            <Link className="text-muted-foreground underline underline-offset-4" href="/">
              Back to home
            </Link>
          </p>
        </div>
        <RegisterForm />
      </section>
    </main>
  );
}
