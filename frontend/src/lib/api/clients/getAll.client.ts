import api from "@/lib/api/api";
import { type ClientsApiResponse } from "@/types/clients_types/types";
import qs from "qs";

// Define filter/sort options type
export interface GetAllClientsOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "name" | "email" | "company" | "status";
  sortOrder?: "asc" | "desc";
  categoryIds?: number[];
  tagIds?: number[];
  status?: "active" | "inactive" | "prospect";
  paymentTermIds?: number[];
  currencyIds?: number[];
  noCache?: boolean;
}

export const getAllClients = async (
  options: GetAllClientsOptions = {}
): Promise<ClientsApiResponse> => {
  const res = await api.get<ClientsApiResponse>("/clients/getAll", {
    params: options,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "comma" }),
  });
  return res.data;
};
