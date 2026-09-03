"use client";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this task?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
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
