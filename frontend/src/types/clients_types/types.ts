import { z } from "zod";

export interface ClientTag {
  id: number;
  name: string;
  color: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  tags?: ClientTag[];
  userId: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClientsApiResponse {
  data: {
    data: Client[];
    meta: PaginationMeta;
    message: string | null;
  };
  limit: number;
  page: number;
  success: boolean;
}

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
