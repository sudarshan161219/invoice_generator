import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

export const registerSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
  username: z
    .string()
    .trim()
    .nonempty("Name cannot be empty")
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name is too long"),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
