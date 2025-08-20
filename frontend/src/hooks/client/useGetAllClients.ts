import { useQuery } from "@tanstack/react-query";
import {
  getAllClients,
  type GetAllClientsOptions,
} from "@/lib/api/clients/getAll.client";
import { type ClientsApiResponse } from "@/types/clients_types/types";

export const useGetAllClients = (options: GetAllClientsOptions = {}) => {
  return useQuery<ClientsApiResponse, Error>({
    queryKey: ["clients", options],
    queryFn: () => getAllClients(options),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    // keepPreviousData: true
  });
};
