import api from "@/lib/api/api";

export interface CategoryCreateForm {
  name: string;
  color?: string;
  isDefault?: boolean;
}

export const createCategory = async (data: CategoryCreateForm) => {
  const res = await api.post("/categories", data);
  return res.data;
};
