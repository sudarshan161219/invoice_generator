import { useContext } from "react";
import { InvoiceClientContext } from "@/context/invoice_client-context";
import type { InvoiceClientContextType } from "@/types/invoiceClientContext";

export const useInvoiceClient = (): InvoiceClientContextType => {
  const context = useContext(InvoiceClientContext);
  if (!context) throw new Error("useInvoiceClient must be used within an AppProvider");
  return context;
};
