export function EmptyTask({
  canManage,
  action,
}: {
  canManage: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
      <p>No Tasks Yet</p>
      {canManage && <div className="mt-3">{action}</div>}
    </div>
  );
}
