import { useState } from "react";
import type { ReactNode } from "react";
import { ClientContext } from "@/context/Client-context";
import type { ClientContextType } from "@/types/clientContext";
import type { Client } from "@/types/client";

type AppProviderProps = {
  children: ReactNode;
};

export const ClientProvider = ({ children }: AppProviderProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [clientId, setClientId] = useState(0);
  const [clientName, setClientName] = useState("");

  const value: ClientContextType = {
    client,
    setClient,
    clientId,
    setClientId,
    clientName,
    setClientName,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};
