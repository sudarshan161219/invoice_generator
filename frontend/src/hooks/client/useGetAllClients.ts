import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "@/lib/api/clients/getAll.client";
import { type ClientsApiResponse } from "@/types/clients_types/types";

export const useGetAllClients = () => {
  return useQuery<ClientsApiResponse, Error>({
    queryKey: ["clients"],
    queryFn: getAllClients,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
