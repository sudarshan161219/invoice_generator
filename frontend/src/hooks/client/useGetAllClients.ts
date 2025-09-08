import { useQuery } from "@tanstack/react-query";
import {
  getAllClients,
  type GetAllClientsOptions,
} from "@/lib/api/clients/getAll.client";
import { type ClientsApiResponse } from "@/types/clients_types/types";

export const useGetAllClients = (options: GetAllClientsOptions = {}) => {
  const { ...queryKeyOptions } = options;
  return useQuery<ClientsApiResponse, Error>({
    queryKey: ["clients", queryKeyOptions],
    queryFn: () => getAllClients(options),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
