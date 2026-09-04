"use client";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { useDeleteTask } from "../hooks/use-delete-task";
export function DeleteTaskDialog({
  taskId,
  columnId,
  open,
  onOpenChange,
}: {
  taskId: string;
  columnId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = useDeleteTask(columnId);
  function remove() {
    mutation.mutate(taskId, { onSuccess: () => onOpenChange(false) });
  }
  return <ConfirmDialog open={open} onOpenChange={onOpenChange} title="Delete this task?" description="This action cannot be undone." confirmLabel="Delete" loading={mutation.isPending} onConfirm={remove} />;
}
