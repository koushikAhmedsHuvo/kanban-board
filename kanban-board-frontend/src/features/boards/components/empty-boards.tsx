import { LayoutDashboard } from "lucide-react";
import { CreateBoardDialog } from "./create-board-dialog";
export function EmptyBoards() { return <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center"><LayoutDashboard className="mb-4 size-8 text-muted-foreground" /><h2 className="text-lg font-semibold">No Boards Yet</h2><p className="mt-1 text-sm text-muted-foreground">Create your first board.</p><div className="mt-5"><CreateBoardDialog /></div></div>; }
