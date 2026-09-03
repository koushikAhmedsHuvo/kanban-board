"use client";
import { useState } from "react";
import { LoaderCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BoardMember, ManageableRole } from "../types/member.types";
import { useUpdateMemberRole } from "../hooks/use-update-member-role";
export function UpdateRoleDialog({
  boardId,
  member,
}: {
  boardId: string;
  member: BoardMember;
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<ManageableRole>(
    member.role === "VIEWER" ? "VIEWER" : "EDITOR",
  );
  const mutation = useUpdateMemberRole(boardId);
  function save() {
    mutation.mutate(
      { memberId: member.id, role },
      { onSuccess: () => setOpen(false) },
    );
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setRole(member.role === "VIEWER" ? "VIEWER" : "EDITOR");
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Change ${member.user.name} role`}
          >
            <Pencil />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Role</DialogTitle>
          <DialogDescription>
            Change {member.user.name}&apos;s board role.
          </DialogDescription>
        </DialogHeader>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as ManageableRole)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EDITOR">EDITOR</SelectItem>
            <SelectItem value="VIEWER">VIEWER</SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={mutation.isPending} onClick={save}>
            {mutation.isPending && <LoaderCircle className="animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
