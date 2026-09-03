"use client";
import { useState } from "react";
import type { Task } from "../types/task.types";
import { useColumnTasks } from "../hooks/use-column-tasks";
import { TaskSkeleton } from "./task-skeleton";
import { EmptyTask } from "./empty-task";
import { SortableTask } from "./sortable-task";
import { TaskDetailsDialog } from "./task-details-dialog";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
export function TaskList({ columnId, canManage, createAction }: { columnId: string; canManage: boolean; createAction?: React.ReactNode }) { const query = useColumnTasks(columnId); const [selected, setSelected] = useState<Task | null>(null); if (query.isLoading) return <TaskSkeleton />; if (query.isError) return <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">Unable to load tasks.</p>; if (!query.data?.length) return <EmptyTask canManage={canManage} action={createAction} />; return <><SortableContext items={query.data.map((task) => task.id)} strategy={verticalListSortingStrategy}><div className="grid gap-2">{query.data.map((task) => <SortableTask key={task.id} task={task} canMove={canManage} onOpen={() => setSelected(task)} />)}</div></SortableContext>{selected && <TaskDetailsDialog taskId={selected.id} columnId={columnId} canManage={canManage} open onOpenChange={(open) => !open && setSelected(null)} />}</>; }
