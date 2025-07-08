import type { Client } from "./client";
import type { Payment } from "./payment";

export type InvoiceStatus = "pending" | "paid" | "overdue";

export interface Invoice {
  id: number;
  invoiceNumber?: string;
  userId: number;
  clientId: number;
  clientName: string;
  amount: number;
  dueDate: string; // ISO date string
  paid: boolean;
  notes?: string;
  support?: string;
  description?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  status: InvoiceStatus;

  // Relations
  client?: Client;
  payments?: Payment[];
}
