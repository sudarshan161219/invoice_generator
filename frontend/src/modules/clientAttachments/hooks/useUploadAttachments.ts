import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMultipleAttachments } from "@/modules/client/api/uploadFile.client";

export const useUploadAttachments = (clientId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      formData,
      signal,
      onProgress,
    }: {
      formData: FormData;
      signal: AbortSignal;
      onProgress?: (progress: {
        percent: number;
        loaded: number;
        total: number;
      }) => void;
    }) => uploadMultipleAttachments(formData, signal, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", clientId] });
    },
  });
};
