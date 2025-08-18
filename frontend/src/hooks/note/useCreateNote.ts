import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/note/create.note.api";
import { useModal } from "../useModal";

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { setNoteEdit } = useModal();

  return useMutation({
    mutationFn: createNote,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", variables.clientId, variables.invoiceId],
      });
      setNoteEdit(null);
    },
  });
};
