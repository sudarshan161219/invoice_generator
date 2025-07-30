import api from "@/lib/api";

export const getClientAttachments = async (id: number) => {
  const res = await api.get(`/attachments/upload/${id}`, {
    withCredentials: true,
  });
  return res.data.attachments;
};
