import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/api/clients/create.client";
import {
  type Client,
  type ClientCreateForm,
  type ClientTag,
} from "@/types/clients_types/types";
import { useAuth } from "@/hooks/useAuth";

type MutationContext = {
  previousClients?: Client[];
  tempId?: number;
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation<Client, unknown, ClientCreateForm, MutationContext>({
    mutationFn: createClient,
    onMutate: async (newClientData) => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });

      const previousClients = queryClient.getQueryData<Client[]>(["clients"]);
      const tempId = Math.random();

      // Add temporary IDs to tags if they exist
      const tempTags: ClientTag[] | undefined = newClientData.tags?.map(
        (tagName) => ({
          id: Math.random(), // temporary ID
          name: tagName, // the string becomes the name
          color: undefined, // optional
          userId, // assign logged-in userId
        })
      );

      const tempClient: Client = {
        id: tempId,
        name: newClientData.name,
        email: newClientData.email ?? "",
        phone: newClientData.phone,
        company: newClientData.company,
        address: newClientData.address,
        tags: tempTags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: userId,
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
    },
    onSuccess: (createdClient, _variables, context) => {
      // Replace temporary client with real server response
      queryClient.setQueryData<Client[]>(["clients"], (old = []) =>
        old.map((client) =>
          client.id === context?.tempId ? createdClient : client
        )
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
