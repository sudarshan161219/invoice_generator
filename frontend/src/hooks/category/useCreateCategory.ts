import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  type CategoryCreateForm,
} from "@/lib/api/category/create.category";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryCreateForm) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
