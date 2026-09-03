"use client";
import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import type { Column } from "../types/column.types";
import { ColumnHeader } from "./column-header";
import { UpdateColumnDialog } from "./update-column-dialog";
import { DeleteColumnDialog } from "./delete-column-dialog";
export function ColumnCard({ column, canManage, boardId }: { column: Column; canManage: boolean; boardId: string }) { const [editOpen, setEditOpen] = React.useState(false); const [deleteOpen, setDeleteOpen] = React.useState(false); const sortable = useSortable({ id: column.id, disabled: !canManage }); const style = { transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }; return <div ref={sortable.setNodeRef} style={style} className="min-w-72"><Card className={sortable.isDragging ? "opacity-60 shadow-lg" : ""}><CardContent className="p-4"><ColumnHeader column={column} canManage={canManage} onEdit={() => setEditOpen(true)} onDelete={() => setDeleteOpen(true)} dragHandleProps={{ ...sortable.attributes, ...sortable.listeners }} /><div className="mt-6 min-h-28 rounded-lg bg-muted/40 p-4 text-center text-sm text-muted-foreground">Tasks will appear here in Phase 6.</div></CardContent></Card>{canManage && <><UpdateColumnDialog boardId={boardId} column={column} open={editOpen} onOpenChange={setEditOpen} /><DeleteColumnDialog boardId={boardId} column={column} open={deleteOpen} onOpenChange={setDeleteOpen} /></>}</div>; }
