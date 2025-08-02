import api from "@/lib/api/api";

export const handleDeleteAttachments = async (ids: number | number[]) => {
  const idArray = Array.isArray(ids) ? ids : [ids];
  if (idArray.length === 1) {
    const res = await api.delete(`/attachments/delete/${idArray[0]}`, {
      withCredentials: true,
    });
    return res.data;
  }
  const res = await api.delete(`/attachments`, {
    data: { ids: idArray },
    withCredentials: true,
  });

  return res.data;
};
