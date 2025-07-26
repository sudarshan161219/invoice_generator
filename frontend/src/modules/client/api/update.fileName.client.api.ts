import api from "@/lib/api";

export const updateAttachmentName = async (id: number, filename: string) => {
  const res = await api.patch(
    `/attachments/update/${id}`,
    { filename },
    { withCredentials: true }
  );

  return res.data.attachment;
};
