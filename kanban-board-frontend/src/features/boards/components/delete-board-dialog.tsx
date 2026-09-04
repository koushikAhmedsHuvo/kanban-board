"use client";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { useDeleteBoard } from "../hooks/use-delete-board";
import { useRouter } from "next/navigation";
export function DeleteBoardDialog({ boardId }: { boardId: string }) {
  const mutation = useDeleteBoard();
  const router = useRouter();
  function remove() {
    mutation.mutate(boardId, { onSuccess: () => router.push("/boards") });
  }
  return (
    <ConfirmDialog
      title="Delete this board?"
      description="This action cannot be undone."
      confirmLabel="Delete"
      loading={mutation.isPending}
      onConfirm={remove}
      trigger={<Button variant="destructive"><Trash2 />Delete Board</Button>}
    />
  );
}
