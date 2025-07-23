// /getSignedUrl/:id

import api from "@/lib/api";

export const handleOpenFile = async (id: number) => {
  const res = await api.get(`/attachments/getSignedUrl/${id}`, {
    withCredentials: true,
  });
  const { url } = res.data;
  window.open(url, "_blank");
};
