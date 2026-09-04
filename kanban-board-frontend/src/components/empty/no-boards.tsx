import { EmptyState } from "./empty-state";

export function NoBoards({ action }: { action?: React.ReactNode }) {
  return <EmptyState title="No Boards Found" description="Create your first board." action={action} />;
}
