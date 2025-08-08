import { useCreateNote } from "./useCreateNote";
import { useUpdateNote } from "./useUpdateNote";
import type { noteDTO } from "@/types/note_types/types";

export const useSaveNote = () => {
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();

  const mutate = (params: { noteId?: number; data: noteDTO }) => {
    if (params.noteId !== undefined) {
      // Pass only after narrowing
      updateMutation.mutate({
        noteId: params.noteId,
        data: params.data,
      });
    } else {
      createMutation.mutate(params.data);
    }
  };

  return {
    mutate,
    isPending: createMutation.isPending || updateMutation.isPending,
    isSuccess: createMutation.isSuccess || updateMutation.isSuccess,
    isError: createMutation.isError || updateMutation.isError,
    error: createMutation.error || updateMutation.error,
  };
};
