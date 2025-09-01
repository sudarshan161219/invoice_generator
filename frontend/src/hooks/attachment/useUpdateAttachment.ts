import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAttachmentName } from "@/lib/api/attachment/update.fileName.client.api";
import { toast } from "sonner";
import { useModal } from "@/hooks/useModal";

export const useUpdateAttachment = (clientId: number) => {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  return useMutation({
    mutationFn: ({ id, filename }: { id: number; filename: string }) =>
      updateAttachmentName(id, filename),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", clientId] });
      toast.success("File name updated");
      closeModal(); // automatically close the modal
      return data;
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to save changes");
    },
  });
};
