// /delete/:id

import api from "@/lib/api";

/**
 * Delete one or multiple attachments
 * @param ids Single ID (number) or array of IDs (number[])
 */
export const handleDeleteAttachments = async (ids: number | number[]) => {
  // Normalize to array
  const idArray = Array.isArray(ids) ? ids : [ids];

  // If single ID → use DELETE /attachments/:id
  if (idArray.length === 1) {
    const res = await api.delete(`/attachments/delete/${idArray[0]}`, {
      withCredentials: true,
    });
    return res.data;
  }

  // Else for multiple → use DELETE /attachments
  const res = await api.delete(`/attachments`, {
    data: { ids: idArray },
    withCredentials: true,
  });

  return res.data;
};
