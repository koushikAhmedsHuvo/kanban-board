"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask } from "../hooks/use-create-task";
import { taskSchema, type TaskFormValues } from "../schemas/task.schema";
export function CreateTaskDialog({ columnId }: { columnId: string }) { const [open, setOpen] = useState(false); const mutation = useCreateTask(columnId); const form = useForm<TaskFormValues>({ resolver: zodResolver(taskSchema), defaultValues: { title: "", description: "" } }); function submit(values: TaskFormValues) { mutation.mutate(values, { onSuccess: () => { form.reset(); setOpen(false); } }); } return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button variant="ghost" size="sm"><Plus />Add Task</Button>} /><DialogContent><DialogHeader><DialogTitle>Create Task</DialogTitle><DialogDescription>Add work to this column.</DialogDescription></DialogHeader><Form {...form}><form onSubmit={form.handleSubmit(submit)} className="grid gap-4"><FormField control={form.control} name="title" render={({ field }) => <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="description" render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} /><DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending && <LoaderCircle className="animate-spin" />}Create</Button></DialogFooter></form></Form></DialogContent></Dialog>; }
