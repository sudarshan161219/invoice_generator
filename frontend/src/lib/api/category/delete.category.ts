import api from "@/lib/api/api";
export const deleteCategory = async (id: number) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};
