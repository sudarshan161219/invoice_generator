import { createContext } from "react";
import type { InvoiceClientContextType } from "@/types/invoiceClientContext";

export const InvoiceClientContext = createContext<InvoiceClientContextType | undefined>(undefined);
