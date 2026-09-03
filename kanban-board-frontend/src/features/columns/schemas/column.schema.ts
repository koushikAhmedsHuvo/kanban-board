import { z } from "zod";
export const columnSchema = z.object({ title: z.string().trim().min(2, "Column name must be at least 2 characters").max(50, "Column name cannot exceed 50 characters") });
export type ColumnFormValues = z.infer<typeof columnSchema>;
