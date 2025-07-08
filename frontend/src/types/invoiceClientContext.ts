import type { Client } from "@/types/client";
import type { Invoice } from "@/types/invoice";

export interface InvoiceClientContextType {
  clientName: string;
  invoiceTitle: string;
  client: Client | null;
  invoice: Invoice | null;
  setClientName: (name: string) => void;
  setInvoiceTitle: (title: string) => void;
  setClient: (data: Client) => void;
  setInvoice: (data: Invoice) => void;
}
