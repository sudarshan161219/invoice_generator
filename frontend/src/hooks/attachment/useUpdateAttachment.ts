import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAttachmentName } from "@/lib/api/attachment/update.fileName.client.api";

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
