import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/modules/client/api/get.client.api";

export const useGetClient = (id: number) =>
  useQuery({
    queryKey: ["client", id],
    queryFn: () => getClient(id),
    enabled: !!id,
  });
