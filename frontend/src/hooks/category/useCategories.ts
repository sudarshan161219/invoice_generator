import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/lib/api/category/delete.category";
import { getCategories } from "@/lib/api/category/get.categories";
import {
  updateCategory,
  type CategoryUpdateForm,
} from "@/lib/api/category/update.category";
import {
  createCategory,
  type CategoryCreateForm,
} from "@/lib/api/category/create.category";

type Category = {
  id: number;
  name: string;
  color: string;
  isDefault?: boolean;
};

// predefined local categories
const defaultCategories: Category[] = [
  { id: -1, name: "VIP", color: "#ef4444", isDefault: true },
  { id: -2, name: "Regular", color: "#3b82f6", isDefault: true },
  { id: -3, name: "One-time", color: "#22c55e", isDefault: true },
];

export const useCategories = () => {
  const queryClient = useQueryClient();

  // fetch user-created categories from API
  const { data: apiCategories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // combine predefined + API categories
  const categories: Category[] = [...defaultCategories, ...apiCategories];

  const addCategory = useMutation({
    mutationFn: (data: CategoryCreateForm) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const editCategory = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdateForm }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const removeCategory = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categories,
    isLoading,
    addCategory,
    editCategory,
    removeCategory,
  };
};
