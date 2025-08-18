import { useContext } from "react";
import { NotesModalContext } from "@/context/notesModal-context";
import type { NoteModalContextType } from "@/types/notesModal";

export const useModal = (): NoteModalContextType => {
  const context = useContext(NotesModalContext);
  if (!context) throw new Error("useModal must be used within an AuthProvider");
  return context;
};
