import { NoTasks } from "@/components/empty/no-tasks";
export function EmptyTask({
  canManage,
  action,
}: {
  canManage: boolean;
  action?: React.ReactNode;
}) {
  return <NoTasks action={canManage ? action : undefined} />;
}
