"use client";
import { GripVertical, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Column } from "../types/column.types";
export function ColumnHeader({
  column,
  canManage,
  onEdit,
  onDelete,
  dragHandleProps,
}: {
  column: Column;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2">
        <button
          aria-label={`Drag ${column.title}`}
          className="cursor-grab text-muted-foreground"
          {...dragHandleProps}
        >
          <GripVertical className="size-4" />
        </button>
        <div>
          <h2 className="font-semibold">{column.title}</h2>
          <p className="text-sm text-muted-foreground">
            Tasks: {column.taskCount}
          </p>
        </div>
      </div>
      {canManage && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Actions for ${column.title}`}
              />
            }
          >
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onEdit}>Edit column</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              Delete column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
