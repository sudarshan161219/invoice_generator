import { useQuery } from "@tanstack/react-query";
import { getClientAttachments } from "@/lib/api/attachment/getAttachments.client.api";

export const useClientAttachments = (clientId: number) => {
  return useQuery({
    queryKey: ["attachments", clientId],
    queryFn: () => getClientAttachments(clientId),
    enabled: !!clientId,
  });
};
