import { useContext } from "react";
import { NotesModalContext } from "@/context/notesModal-context";
import type { NoteModalContextType } from "@/types/notesModal";

export const useNotesModal = (): NoteModalContextType => {
  const context = useContext(NotesModalContext);
  if (!context)
    throw new Error("useNotesModal must be used within an AuthProvider");
  return context;
};
