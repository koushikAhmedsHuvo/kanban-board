import { CreateBoardDialog } from "./create-board-dialog";
import { NoBoards } from "@/components/empty/no-boards";
export function EmptyBoards() {
  return <NoBoards action={<CreateBoardDialog />} />;
}
