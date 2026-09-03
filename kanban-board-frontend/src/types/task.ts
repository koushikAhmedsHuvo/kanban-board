export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  columnId: string;
  title: string;
  description?: string | null;
  position: number;
  priority?: TaskPriority | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}
