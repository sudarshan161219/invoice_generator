import api from "@/lib/api/api";
import { type ClientsApiResponse } from "@/types/clients_types/types"

export const getAllClients = async (): Promise<ClientsApiResponse> => {
  const res = await api.get<ClientsApiResponse>("/clients/getAll");
  return res.data;
};
