export interface Column {
  id: string;
  title: string;
  position: number;
  taskCount: number;
}
export interface CreateColumnRequest {
  title: string;
}
export interface UpdateColumnRequest {
  title: string;
}
export interface MoveColumnRequest {
  targetPosition: number;
}
export interface RawColumn extends Omit<Column, "taskCount"> {
  _count?: { tasks: number };
  taskCount?: number;
}
