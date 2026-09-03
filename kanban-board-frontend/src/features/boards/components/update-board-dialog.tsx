"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateBoard } from "../hooks/use-update-board";
import { boardSchema, type BoardFormValues } from "../schemas/board.schema";
export function UpdateBoardDialog({
  boardId,
  currentName,
}: {
  boardId: string;
  currentName: string;
}) {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateBoard();
  const form = useForm<BoardFormValues>({
    resolver: zodResolver(boardSchema),
    defaultValues: { name: currentName },
  });
  function submit(values: BoardFormValues) {
    mutation.mutate(
      { boardId, name: values.name },
      { onSuccess: () => setOpen(false) },
    );
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) form.reset({ name: currentName });
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline">
            <Pencil />
            Edit Board
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Board</DialogTitle>
          <DialogDescription>Change the name of this board.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <LoaderCircle className="animate-spin" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
