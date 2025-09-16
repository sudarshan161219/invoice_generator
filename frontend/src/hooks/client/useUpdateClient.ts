import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient } from "@/lib/api/clients/update.client"; // path to your API helper
import type { ClientFormState } from "@/types/clients_types/ClientFormState";

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<ClientFormState>;
    }) => updateClient(id, data),

    // ✅ Optimistic update & cache invalidation
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", updated.data.id] });
    },
  });
}
