import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/note/create.note.api";
import { useNotesModal } from "../useNotesModal";

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { setNoteEdit } = useNotesModal();

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
