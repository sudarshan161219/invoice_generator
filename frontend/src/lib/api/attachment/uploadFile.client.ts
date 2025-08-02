import api from "@/lib/api/api";
import { type UploadAttachmentResponse } from "@/types/attachment_types/types";

export const uploadMultipleAttachments = async (
  formData: FormData,
  signal: AbortSignal,
  onProgress?: (progress: {
    percent: number;
    loaded: number;
    total: number;
  }) => void
): Promise<UploadAttachmentResponse[]> => {
  const res = await api.post<UploadAttachmentResponse[]>(
    "/attachments/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percent = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        onProgress?.({
          percent,
          loaded: progressEvent.loaded,
          total: progressEvent.total || 0,
        });
      },
      signal,
    }
  );
  return res.data;
};
