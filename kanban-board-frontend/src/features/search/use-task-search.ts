"use client";
import { useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import type { Task } from "@/features/tasks/types/task.types";
export function useTaskSearch(tasks: Task[], search: string) { const debounced = useDebounce(search); return useMemo(() => { const term = debounced.trim().toLowerCase(); if (!term) return tasks; return tasks.filter((task) => `${task.title} ${task.description ?? ""}`.toLowerCase().includes(term)); }, [debounced, tasks]); }
