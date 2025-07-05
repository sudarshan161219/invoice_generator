import { z } from "zod";

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
