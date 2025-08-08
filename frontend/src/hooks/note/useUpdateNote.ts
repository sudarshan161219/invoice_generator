import { updateNote } from "@/lib/api/note/update.note.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotesModal } from "../useNotesModal";

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  const { setNoteEdit } = useNotesModal();

  return useMutation({
    mutationFn: updateNote,
    onSuccess: (_data, { data }) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", data.clientId, data.invoiceId],
      });
      setNoteEdit(null);
    },
  });
};
