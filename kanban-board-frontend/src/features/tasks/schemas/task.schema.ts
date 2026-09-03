import { z } from "zod";
export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title cannot exceed 200 characters"),
  description: z
    .string()
    .max(5000, "Description cannot exceed 5000 characters")
    .optional(),
});
export type TaskFormValues = z.infer<typeof taskSchema>;
