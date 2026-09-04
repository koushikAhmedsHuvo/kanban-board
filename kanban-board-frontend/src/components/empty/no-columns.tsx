import { EmptyState } from "./empty-state";

export function NoColumns({ action }: { action?: React.ReactNode }) {
  return <EmptyState title="No Columns Yet" description="Create your first column." action={action} />;
}
