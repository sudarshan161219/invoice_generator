import type { Client } from "@/types/client";

export interface ClientContextType {
  clientId: number;
  clientName: string;
  client: Client | null;
  setClientName: (name: string) => void;
  setClient: (data: Client) => void;
  setClientId: (id: number) => void;
}
