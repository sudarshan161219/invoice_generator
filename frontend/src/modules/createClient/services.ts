import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .min(1, "Client name is required")
    .max(100, "Client name must be under 100 characters"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be under 100 characters"),

  phone: z
    .string()
    .regex(/^[\d+-]*$/, "Phone number can only contain numbers, +, and -")
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number must be under 20 digits")
    .optional(),

  company: z
    .string()
    .max(100, "Company name must be under 100 characters")
    .optional(),

  address: z
    .string()
    .max(250, "Address must be under 250 characters")
    .optional(),

  tags: z
    .array(
      z.object({
        name: z.string(),
        color: z.string().optional().default("#3b82f6"),
      })
    )
    .max(10, "You can add a maximum of 10 tags")
    .default([]),
});

export type ClientCreateForm = z.infer<typeof clientSchema>;


export type ClientFormValues = {
  tags: { name: string; color: string }[];
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
};