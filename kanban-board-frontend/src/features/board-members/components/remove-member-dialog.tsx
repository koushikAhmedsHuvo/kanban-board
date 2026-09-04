"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import type { BoardMember } from "../types/member.types";
import { useRemoveMember } from "../hooks/use-remove-member";
export function RemoveMemberDialog({
  boardId,
  member,
}: {
  boardId: string;
  member: BoardMember;
}) {
  const [open, setOpen] = useState(false);
  const mutation = useRemoveMember(boardId);
  function remove() {
    mutation.mutate(member.id, { onSuccess: () => setOpen(false) });
  }
  return <ConfirmDialog open={open} onOpenChange={setOpen} title="Remove this member?" description="This action cannot be undone." confirmLabel="Remove" loading={mutation.isPending} onConfirm={remove} trigger={<Button variant="ghost" size="icon" aria-label={`Remove ${member.user.name}`}><Trash2 /></Button>} />;
}
