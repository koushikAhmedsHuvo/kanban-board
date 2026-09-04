"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { useDeleteColumn } from "../hooks/use-delete-column";
import type { Column } from "../types/column.types";
export function DeleteColumnDialog({
  boardId,
  column,
  open,
  onOpenChange,
}: {
  boardId: string;
  column: Column;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const mutation = useDeleteColumn(boardId);
  function remove() {
    mutation.mutate(column.id, { onSuccess: () => setOpen(false) });
  }
  return <ConfirmDialog open={dialogOpen} onOpenChange={setOpen} title="Delete this column?" description={column.taskCount > 0 ? "Cannot delete non-empty column." : "This action cannot be undone."} confirmLabel="Delete" loading={mutation.isPending || column.taskCount > 0} onConfirm={remove} trigger={!isControlled ? <Button variant="ghost" size="icon" aria-label={`Delete ${column.title}`}><Trash2 /></Button> : undefined} />;
}
