import api from "@/lib/api/api";
import type { noteDTO, NoteId } from "@/types/note_types/types";

export const updateNote = async ({
  noteId,
  data,
}: {
  noteId: NoteId;
  data: noteDTO;
}) => {
  const res = await api.patch(`/note/update/${noteId}`, data);
  return res.data;
};
