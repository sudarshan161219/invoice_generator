import api from "@/lib/api/api";
export interface CategoryUpdateForm {
  name?: string;
  color?: string;
}

export const updateCategory = async (id: number, data: CategoryUpdateForm) => {
  const res = await api.patch(`/categories/${id}`, data);
  return res.data;
};
