import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/modules/client/api/get.client.api";

export const useClient = (id: number) =>
  useQuery({
    queryKey: ["client", id],
    queryFn: () => getClient(id),
    enabled: !!id,
  });
