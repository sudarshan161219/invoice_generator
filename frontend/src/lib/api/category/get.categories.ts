import api from "@/lib/api/api";

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};
