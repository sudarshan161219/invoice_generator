import { useCreateNote } from "./useCreateNote";
import { useUpdateNote } from "./useUpdateNote";
import type { noteDTO, NoteId } from "@/types/note_types/types";
import { toast } from "sonner";

type SaveNoteParams =
  | { noteId: NoteId; data: noteDTO } // update
  | { noteId: null; data: noteDTO }; // create

export const useSaveNote = () => {
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();

  const mutate = (params: SaveNoteParams) => {
    if (params.noteId !== null) {
      updateMutation.mutate({
        noteId: params.noteId,
        data: params.data,
      });
      toast.success("Note updated successfully!");
    } else {
      createMutation.mutate(params.data);
      toast.success("Note added successfully!");
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
