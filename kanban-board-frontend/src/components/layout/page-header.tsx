import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
      <div>
        {breadcrumb}
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10">{children}</main>;
}

export function SectionContainer({ children }: { children: ReactNode }) {
  return <section className="mx-auto w-full max-w-6xl">{children}</section>;
}
