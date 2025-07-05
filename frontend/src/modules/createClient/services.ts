import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .regex(/^[\d+-]*$/, "Phone can only contain numbers, +, and -")
    .optional()
    .or(z.literal("")),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z
    .array(
      z.object({
        content: z.string().min(1, "Note content is required"),
      })
    )
    .optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

export type ClientCreateForm = z.infer<typeof clientSchema>;
