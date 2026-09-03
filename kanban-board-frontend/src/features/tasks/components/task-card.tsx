"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "../types/task.types";
export const TaskCard = React.memo(function TaskCard({ task, onOpen }: { task: Task; onOpen: () => void }) { return <Card className="cursor-pointer transition-colors hover:border-primary/50" onClick={onOpen} onKeyDown={(event) => { if (event.key === "Enter") onOpen(); }} role="button" tabIndex={0}><CardContent className="p-3"><p className="font-medium">{task.title}</p>{task.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>}</CardContent></Card>; });
