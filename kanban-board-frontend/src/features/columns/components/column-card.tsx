"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import type { Column } from "../types/column.types";
import { ColumnHeader } from "./column-header";
import { UpdateColumnDialog } from "./update-column-dialog";
import { DeleteColumnDialog } from "./delete-column-dialog";
import { TaskList } from "@/features/tasks/components/task-list";
const LazyCreateTaskDialog = dynamic(() =>
  import("@/features/tasks/components/create-task-dialog").then(
    (module) => module.CreateTaskDialog,
  ),
);
export function ColumnCard({
  column,
  canManage,
  boardId,
  search,
}: {
  column: Column;
  canManage: boolean;
  boardId: string;
  search?: string;
}) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const sortable = useSortable({ id: column.id, disabled: !canManage });
  const droppable = useDroppable({ id: column.id });
  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };
  return (
    <div
      ref={(node) => {
        sortable.setNodeRef(node);
        droppable.setNodeRef(node);
      }}
      style={style}
      className="min-w-72"
    >
      <Card className={sortable.isDragging ? "opacity-60 shadow-lg" : ""}>
        <CardContent className="p-4">
          <ColumnHeader
            column={column}
            canManage={canManage}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
            dragHandleProps={{ ...sortable.attributes, ...sortable.listeners }}
          />
          <div className="mt-4">
            <TaskList
              columnId={column.id}
              canManage={canManage}
              search={search}
              createAction={
                canManage ? (
                  <LazyCreateTaskDialog columnId={column.id} />
                ) : undefined
              }
            />
          </div>
          <div className="mt-4">
            {canManage && <LazyCreateTaskDialog columnId={column.id} />}
          </div>
        </CardContent>
      </Card>
      {canManage && (
        <>
          <UpdateColumnDialog
            boardId={boardId}
            column={column}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <DeleteColumnDialog
            boardId={boardId}
            column={column}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      )}
    </div>
  );
}
