import api from "@/lib/api";
import { type Client } from "../../../types/client";

export const getClient = async (id: number): Promise<Client> => {
  const res = await api.get<Client>(`/clients/${id}`);
  return res.data;
};
