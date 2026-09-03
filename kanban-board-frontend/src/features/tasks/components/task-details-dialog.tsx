"use client";
import { useState } from "react";
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
import { useTask } from "../hooks/use-task";
import { UpdateTaskDialog } from "./update-task-dialog";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { useTaskCollaboration } from "@/features/realtime/hooks/use-task-collaboration";
export function TaskDetailsDialog({
  taskId,
  columnId,
  canManage,
  open,
  onOpenChange,
}: {
  taskId: string;
  columnId: string;
  canManage: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const query = useTask(taskId);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { editingUsers } = useTaskCollaboration(taskId, open && canManage);
  const task = query.data;
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{task?.title ?? "Task details"}</DialogTitle>
            <DialogDescription>
              {query.isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                task?.description || "No description"
              )}
            </DialogDescription>
          </DialogHeader>
          {task && (
            <div className="grid gap-3 text-sm">
              {editingUsers.length > 0 && (
                <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-amber-700 dark:text-amber-300">
                  {editingUsers.join(", ")}{" "}
                  {editingUsers.length === 1 ? "is" : "are"} editing this
                  task...
                </p>
              )}
              <p>
                <span className="text-muted-foreground">Created by:</span>{" "}
                {task.createdBy?.name ?? "Unknown"}
              </p>
              <p>
                <span className="text-muted-foreground">Column:</span>{" "}
                {task.column.title}
              </p>
              {task.createdAt && (
                <p>
                  <span className="text-muted-foreground">Created:</span>{" "}
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          {canManage && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(true)}>
                Edit Task
              </Button>
              <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                Delete Task
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      {canManage && (
        <>
          <UpdateTaskDialog
            taskId={taskId}
            columnId={columnId}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <DeleteTaskDialog
            taskId={taskId}
            columnId={columnId}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      )}
    </>
  );
}
