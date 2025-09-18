import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCategory,
  type CategoryUpdateForm,
} from "@/lib/api/category/update.category";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdateForm }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
