import { useContext } from "react";
import { ClientContext } from "@/context/Client-context";
import type { ClientContextType } from "@/types/clientContext";

export const useClient = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (!context)
    throw new Error("useInvoiceClient must be used within an AppProvider");
  return context;
};
