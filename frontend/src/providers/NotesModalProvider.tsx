import { useState, type ReactNode } from "react";
import type { Note, EditedName, EditedFileInfoName } from "@/types/notesModal";
import { NotesModalContext } from "../context/notesModal-context";
import { ModalType } from "@/types/ModalType";

export const NotesModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.None);
  const [editingFileId, setEditingFileId] = useState<number | null>(null);
  const [editingFileInfoId, setEditingFileInfoId] = useState<number | null>(
    null
  );
  const [mode, setMode] = useState<
    "add" | "viewAll" | "addFile" | "viewAllFiles"
  >("viewAll");
  const [note, setNote] = useState<Note>("");
  const [editedName, setEditName] = useState<EditedName>("");
  const [editedFileInfoName, setEditFileinfoName] =
    useState<EditedFileInfoName>("");

  // Setters
  const setNotes = (note: Note) => setNote(note);
  const toggleModal = () => setIsOpen(!isOpen);

  function setEditedValue(
    type: "fileName" | "fileInfo",
    value: EditedName | EditedFileInfoName
  ) {
    if (type === "fileName") setEditName(value as EditedName);
    if (type === "fileInfo") setEditFileinfoName(value as EditedFileInfoName);
  }

  function setEditingId(type: "fileName" | "fileInfo", id: number | null) {
    if (type === "fileName") setEditingFileId(id);
    if (type === "fileInfo") setEditingFileInfoId(id);
  }

  // Toggle functions
  const closeModal = () => setActiveModal(ModalType.None);
  const openModal = (modalType: ModalType) => setActiveModal(modalType);

  const openEditFileNameModal = () =>
    setActiveModal((prev) =>
      prev === ModalType.EditFileName ? ModalType.None : ModalType.EditFileName
    );

  const openEditFileInfoModal = () =>
    setActiveModal((prev) =>
      prev === ModalType.EditFileInfo ? ModalType.None : ModalType.EditFileInfo
    );

  // Content mode
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

  const currentEditedValue =
    activeModal === ModalType.EditFileName
      ? editedName
      : activeModal === ModalType.EditFileInfo
      ? editedFileInfoName
      : "";

  const currentEditingId =
    activeModal === ModalType.EditFileName
      ? editingFileId
      : activeModal === ModalType.EditFileInfo
      ? editingFileInfoId
      : null;

  return (
    <NotesModalContext.Provider
      value={{
        isOpen,
        activeModal,
        mode,
        note,
        editedName,
        editedFileInfoName,
        editingFileId,
        editingFileInfoId,
        openEditFileNameModal,
        openEditFileInfoModal,
        setNotes,
        currentEditingId,
        setEditingId,
        currentEditedValue,
        setEditedValue,
        openAddNote,
        openViewAll,
        openAddFile,
        openViewAllFiles,
        setEditingFileId,
        setEditingFileInfoId,
        closeModal,
        openModal,
        toggleModal,
      }}
    >
      {children}
    </NotesModalContext.Provider>
  );
};
