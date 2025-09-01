import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleDeleteAttachments } from "@/lib/api/attachment/delete.attachment.client.api";

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids }: { ids: number | number[]; clientId: number }) =>
      handleDeleteAttachments(ids),

    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", clientId] });
    },
  });
};
