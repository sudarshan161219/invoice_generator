import api from "@/lib/api";
import { type UploadAttachmentResponse } from "../types/types";

export const uploadMultipleAttachments = async (
  formData: FormData,
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
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress?.({
          percent,
          loaded: progressEvent.loaded,
          total: progressEvent.total,
        });
      },
    }
  );
  return res.data;
};
