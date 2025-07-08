import { useState } from "react";
import type { ReactNode } from "react";
import { InvoiceClientContext } from "@/context/invoice_client-context";
import type { InvoiceClientContextType } from "@/types/invoiceClientContext";
import type { Invoice } from "@/types/invoice";
import type { Client } from "@/types/client";

type AppProviderProps = {
  children: ReactNode;
};

export const InvoiceClientProvider = ({ children }: AppProviderProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [clientName, setClientName] = useState("");
  const [invoiceTitle, setInvoiceTitle] = useState("");

  const value: InvoiceClientContextType = {
    client,
    setClient,
    invoice,
    setInvoice,
    clientName,
    invoiceTitle,
    setClientName,
    setInvoiceTitle,
  };

  return (
    <InvoiceClientContext.Provider value={value}>
      {children}
    </InvoiceClientContext.Provider>
  );
};
