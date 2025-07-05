import { useState, type ReactNode } from "react";
import type { Note } from "@/types/notesModal";
import { NotesModalContext } from "../context/notesModal-context";

export const NotesModalProvider = ({ children }: { children: ReactNode }) => {
  const [notesModal, setNotesModal] = useState(false);
  const [note, setNote] = useState<Note>("");

  const setNotes = (note: Note) => {
    setNote(note);
  };

  const toggleNotesModal = () => {
    setNotesModal((prev) => !prev);
  };

  return (
    <NotesModalContext.Provider
      value={{ notesModal, note, toggleNotesModal, setNotes }}
    >
      {children}
    </NotesModalContext.Provider>
  );
};
