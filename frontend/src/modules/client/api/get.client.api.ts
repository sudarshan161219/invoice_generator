import api from "@/lib/api";
import { type Client } from "../../../types/client";

export const getClient = async (
  id: number
): Promise<{ data: Client; meta?: { source: string; cachedAt: string } }> => {
  const res = await api.get<{
    data: Client;
    meta?: { source: string; cachedAt: string };
  }>(`/clients/${id}`);
  return res.data;
};
