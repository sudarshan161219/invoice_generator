import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/lib/api/category/delete.category";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
