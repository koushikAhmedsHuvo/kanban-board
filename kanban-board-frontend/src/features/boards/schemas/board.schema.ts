import { z } from "zod";

export const boardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Board name must be at least 3 characters")
    .max(100, "Board name cannot exceed 100 characters"),
});

export type BoardFormValues = z.infer<typeof boardSchema>;
