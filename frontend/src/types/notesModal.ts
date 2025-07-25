import { ModalType } from "@/types/ModalType";

export type Note = string;
export type EditedName = string;
export type EditedFileInfoName = string;

export interface NoteModalContextType {
  note: Note;
  editedName: EditedName;
  editingFileId: number | null;
  editingFileInfoId: number | null;
  editedFileInfoName: EditedFileInfoName;
  isOpen: boolean;
  activeModal: ModalType;
  mode: "add" | "viewAll" | "addFile" | "viewAllFiles";
  currentEditedValue: string;
  currentEditingId: number | null;
  setEditedValue: (
    type: "fileName" | "fileInfo",
    value: EditedName | EditedFileInfoName
  ) => void;
  setEditingId: (type: "fileName" | "fileInfo", id: number | null) => void;
  toggleModal: () => void;
  closeModal: () => void;
  openModal: (modalType: ModalType) => void;
  openEditFileNameModal: () => void;
  openEditFileInfoModal: () => void;
  openAddNote: () => void;
  openViewAll: () => void;
  openAddFile: () => void;
  openViewAllFiles: () => void;
  setNotes: (note: Note) => void;
  // setEditFileName: (editedName: EditedName) => void;
  // setEditFileInfoName: (editedName: EditedFileInfoName) => void;
  setEditingFileId: (id: number | null) => void;
  setEditingFileInfoId: (id: number | null) => void;
}
