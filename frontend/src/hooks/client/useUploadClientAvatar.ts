import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadClientAvatar } from "@/lib/api/clients/upload.avatar.client";

export function useUploadClientAvatar(clientId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadClientAvatar(clientId, file),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", updated.data] });
    },
  });
}
