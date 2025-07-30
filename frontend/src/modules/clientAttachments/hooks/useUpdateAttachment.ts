// hooks/useUpdateAttachment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAttachmentName } from "@/modules/client/api/update.fileName.client.api";

export const useUpdateAttachment = (clientId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, filename }: { id: number; filename: string }) =>
      updateAttachmentName(id, filename),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", clientId] });
    },
  });
};
