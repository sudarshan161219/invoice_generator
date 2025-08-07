import api from "@/lib/api/api";
import { type noteDTO } from "@/types/note_types/types";

export const createNote = async (data: noteDTO) => {
  const res = await api.post("/note/create", data);
  return res.data;
};
