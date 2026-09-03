export interface Task { id: string; title: string; description?: string | null; position: number; }
export interface TaskDetails extends Task { column: { id: string; title: string }; createdBy: { id: string; name: string } | null; createdAt?: string; }
export interface CreateTaskRequest { title: string; description?: string; }
export interface UpdateTaskRequest { title?: string; description?: string; }
export interface MoveTaskRequest { targetColumnId: string; targetIndex: number; }
