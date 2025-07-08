import type { Invoice } from "./invoice";

export interface Payment {
  id: number;
  amount: number;
  paidAt: string; // ISO date string
  method: string; // e.g., "cash", "bank", "credit"
  note?: string;
  createdAt: string;
  updatedAt: string;
  invoiceId: number;

  // Optional relation
  invoice?: Invoice;
}

export interface CreatePaymentInput {
  amount: number;
  paidAt?: string;
  method: string;
  note?: string;
  invoiceId: number;
}
