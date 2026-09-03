import { z } from "zod";
export const memberSchema = z.object({ email: z.string().trim().min(1, "Email is required").email("Enter a valid email"), role: z.enum(["EDITOR", "VIEWER"], { message: "Choose a role" }) });
export type MemberFormValues = z.infer<typeof memberSchema>;
