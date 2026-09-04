import { EmptyState } from "./empty-state";

export function NoTasks({ action }: { action?: React.ReactNode }) {
  return <EmptyState title="No Tasks Yet" description="Create your first task." action={action} />;
}
