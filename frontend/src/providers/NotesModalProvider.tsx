import { useState, type ReactNode } from "react";
import type { Note, EditedName } from "@/types/notesModal";
import { NotesModalContext } from "../context/notesModal-context";

export const NotesModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [mode, setMode] = useState<
    "add" | "viewAll" | "addFile" | "viewAllFiles"
  >("viewAll");
  const [note, setNote] = useState<Note>("");
  const [editedName, setEditName] = useState<EditedName>("");

  const setNotes = (note: Note) => {
    setNote(note);
  };

  const setEditFileName = (editFile: EditedName) => {
    setEditName(editFile);
  };

  const toggleNotesModal = () => setIsOpen(!isOpen);
  const toggleEditFileNameModal = () => setIsEditOpen(!isEditOpen);

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
        isEditOpen,
        mode,
        note,
        editedName,
        editingFileId,
        toggleNotesModal,
        toggleEditFileNameModal,
        setNotes,
        setEditFileName,
        openAddNote,
        openViewAll,
        openAddFile,
        openViewAllFiles,
        setEditingFileId,
        // saveEditedFile,
      }}
    >
      {children}
    </NotesModalContext.Provider>
  );
};
