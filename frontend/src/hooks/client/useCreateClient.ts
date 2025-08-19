import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/api/clients/create.client";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useModal } from "@/hooks/useModal";

import {
  type Client,
  type ClientCreateForm,
  type ClientTag,
} from "@/types/clients_types/types";

type MutationContext = {
  previousClients?: Client[];
  tempId?: number;
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { toggleModal } = useModal();
  return useMutation<Client, unknown, ClientCreateForm, MutationContext>({
    mutationFn: createClient,
    onMutate: async (newClientData) => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });

      const previousClients = queryClient.getQueryData<Client[]>(["clients"]);
      const tempId = Math.random();

      // Add temporary IDs to tags if they exist
      const tempTags: ClientTag[] | undefined = newClientData.tags?.map(
        (tagName) => ({
          id: Math.random(),
          name: tagName.name,
          color: tagName.color || "#3b82f6",
        })
      );

      const tempClient: Client = {
        id: tempId,
        name: newClientData.name,
        email: newClientData.email ?? "",
        phone: newClientData.phone,
        company: newClientData.company,
        tags: tempTags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Client[]>(["clients"], (old = []) => [
        ...old,
        tempClient,
      ]);

      return { previousClients, tempId };
    },
    onError: (_err, _newClientData, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(["clients"], context.previousClients);
      }
      const axiosError = _err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    },
    onSuccess: (createdClient, _variables, context) => {
      // Replace temporary client with real server response
      queryClient.setQueryData<Client[]>(["clients"], (old = []) =>
        old.map((client) =>
          client.id === context?.tempId ? createdClient : client
        )
      );
      toast.success("Client added successfully!");
      toggleModal();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
