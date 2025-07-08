import api from "@/lib/api";
import { type ClientsApiResponse } from "../types/clients";

export const getAllClients = async (): Promise<ClientsApiResponse> => {
  const res = await api.get<ClientsApiResponse>("/clients/getAll");
  return res.data;
};
