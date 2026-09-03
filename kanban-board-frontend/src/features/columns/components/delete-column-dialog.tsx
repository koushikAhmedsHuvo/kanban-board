"use client";
import { useState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  return (
    <Dialog open={dialogOpen} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Delete ${column.title}`}
            >
              <Trash2 />
            </Button>
          }
        />
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this column?</DialogTitle>
          <DialogDescription>
            {column.taskCount > 0
              ? "Cannot delete non-empty column."
              : "This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={mutation.isPending || column.taskCount > 0}
            onClick={remove}
          >
            {mutation.isPending && <LoaderCircle className="animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
