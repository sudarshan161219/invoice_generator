import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  website: z.union([z.string().url(), z.literal("")]).optional(),
  status: z.enum(["active", "inactive", "prospect"], {
    required_error: "Status is required",
  }),
  taxId: z.string().optional(),
  taxIdType: z.string().optional(),
  notes: z.string().optional(),
  socialLinks: z
    .record(
      z.string().url("Must be a valid URL") // values must be URLs
    )
    .refine((val) => Object.keys(val).every((k) => k.trim().length > 0), {
      message: "Social link keys cannot be empty",
    })
    .optional(),
  category: z.enum(["vip", "regular", "one-time"], {
    required_error: "Category is required",
  }),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
