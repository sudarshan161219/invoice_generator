// hooks/useClientAttachments.ts
import { useQuery } from "@tanstack/react-query";
import { getClientAttachments } from "@/modules/client/api/getAttachments.client.api";

export const useClientAttachments = (clientId: number) =>
  useQuery({
    queryKey: ["attachments", clientId],
    queryFn: () => getClientAttachments(clientId),
    enabled: !!clientId,
  });
