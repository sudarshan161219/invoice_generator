import api from "@/lib/api";
import { type UploadAttachmentResponse } from "../types/types";

export const uploadMultipleAttachments = async (
  formData: FormData
): Promise<UploadAttachmentResponse[]> => {
  const res = await api.post<UploadAttachmentResponse[]>("/attachments/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};