import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleDeleteAttachments } from "@/lib/api/attachment/delete.attachment.client.api";

export const useDeleteAttachment = (clientId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number | number[]) => handleDeleteAttachments(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", clientId] });
    },
  });
};


