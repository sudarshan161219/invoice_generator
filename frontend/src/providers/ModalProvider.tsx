import { useState, type ReactNode } from "react";
import type {
  Note,
  EditedName,
  EditedFileInfoName,
  editnoteDTO,
  Tag,
} from "@/types/notesModal";
import { NotesModalContext } from "../context/notesModal-context";
import { ModalType } from "@/types/ModalType";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileId, setFileID] = useState<number | number[] | null>(null);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.None);
  const [editingFileId, setEditingFileId] = useState<number | null>(null);
  const [editingFileInfoId, setEditingFileInfoId] = useState<number | null>(
    null
  );
  const [mode, setMode] = useState<
    | "add"
    | "edit"
    | "viewAll"
    | "addFile"
    | "viewAllFiles"
    | "warning"
    | "clientEdit"
  >("viewAll");
  const [note, setNote] = useState<Note>("");
  const [editedName, setEditName] = useState<EditedName>("");
  const [editedFileInfoName, setEditFileinfoName] =
    useState<EditedFileInfoName>("");
  const [noteEdit, setNoteEdit] = useState<editnoteDTO | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);

  // Setters
  const setNotes = (note: Note) => setNote(note);
  const toggleModal = () => setIsOpen(!isOpen);
  const fileID = (id: number | number[]) => setFileID(id);

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

  const openEditNote = () => {
    setMode("edit");
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

  const openWarning = () => {
    setMode("warning");
    setIsOpen(true);
  };

  const openClientEdit = () => {
    setMode("clientEdit");
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
        openEditNote,
        openViewAll,
        openAddFile,
        openViewAllFiles,
        openWarning,
        openClientEdit,
        fileID,
        fileId,
        setEditingFileId,
        setEditingFileInfoId,
        closeModal,
        openModal,
        toggleModal,
        noteEdit,
        setNoteEdit,
        noteId,
        setNoteId,
        tags,
        setTags,
      }}
    >
      {children}
    </NotesModalContext.Provider>
  );
};
