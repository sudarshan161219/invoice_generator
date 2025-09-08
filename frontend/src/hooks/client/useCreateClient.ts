import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/api/clients/create.client";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useModal } from "@/hooks/useModal";

import {
  type Client,
  type ClientCreateForm,
} from "@/types/clients_types/types";
import { getAllClients } from "@/lib/api/clients/getAll.client";

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  return useMutation<Client, unknown, ClientCreateForm>({
    mutationFn: createClient,

    onError: (err) => {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message ?? "Failed to add client");
    },

    onSuccess: () => {
      toast.success("Client added successfully!");
      closeModal();

      queryClient.refetchQueries({
        queryKey: ["clients"],
        type: "all",
        exact: false,
      });

      queryClient.fetchQuery({
        queryKey: ["clients", { page: 1, limit: 10, noCache: true }],
        queryFn: () => getAllClients({ page: 1, limit: 10, noCache: true }),
      });
    },

    onSettled: () => {
      // mark as stale to ensure fresh data everywhere
      queryClient.invalidateQueries({ queryKey: ["clients"], exact: false });
    },
  });
};
