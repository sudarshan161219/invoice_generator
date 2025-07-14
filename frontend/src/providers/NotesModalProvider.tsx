import { useState, type ReactNode } from "react";
import type { Note } from "@/types/notesModal";
import { NotesModalContext } from "../context/notesModal-context";

export const NotesModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<
    "add" | "viewAll" | "addFile" | "viewAllFiles"
  >("viewAll");
  const [note, setNote] = useState<Note>("");

  const setNotes = (note: Note) => {
    setNote(note);
  };

  const toggleNotesModal = () => setIsOpen(!isOpen);
  const openAddNote = () => {
    setMode("add");
    setIsOpen(true);
  };
  const openViewAll = () => {
    setMode("viewAll");
    setIsOpen(true);
  };

  const openAddFile = () => {
    setMode("addFile");
    setIsOpen(true);
  };
  const openViewAllFiles = () => {
    setMode("viewAllFiles");
    setIsOpen(true);
  };

  return (
    <NotesModalContext.Provider
      value={{
        isOpen,
        mode,
        note,
        toggleNotesModal,
        setNotes,
        openAddNote,
        openViewAll,
        openAddFile,
        openViewAllFiles,
      }}
    >
      {children}
    </NotesModalContext.Provider>
  );
};
