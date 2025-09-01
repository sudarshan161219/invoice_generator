import { createContext } from "react";
import type { ClientContextType } from "@/types/clientContext";

export const ClientContext = createContext<ClientContextType | undefined>(
  undefined
);
