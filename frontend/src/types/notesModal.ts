import { ModalType } from "@/types/ModalType";

export type Note = string;
export type EditedName = string;
export type EditedFileInfoName = string;
export type NoteType = "general" | "invoiceRelated";
export type editnoteDTO = {
  title: string;
  content: string;
  label: {
    name: string;
    color: string;
  };
};
export interface Tag {
  name: string;
  color?: string;
}

export interface NoteModalContextType {
  note: Note;
  editedName: EditedName;
  fileId: number | number[] | null;
  noteId: number | null;
  editingFileId: number | null;
  editingFileInfoId: number | null;
  editedFileInfoName: EditedFileInfoName;
  noteEdit: editnoteDTO | null;
  isOpen: boolean;
  tags: Tag[];
  activeModal: ModalType;
  mode:
    | "add"
    | "edit"
    | "viewAll"
    | "addFile"
    | "viewAllFiles"
    | "warning"
    | "clientEdit";
  currentEditedValue: string;
  currentEditingId: number | null;
  setEditedValue: (
    type: "fileName" | "fileInfo",
    value: EditedName | EditedFileInfoName
  ) => void;
  setEditingId: (type: "fileName" | "fileInfo", id: number | null) => void;
  toggleModal: () => void;
  fileID: (id: number | number[]) => void;
  closeModal: () => void;
  openModal: (modalType: ModalType) => void;
  openEditFileNameModal: () => void;
  openEditFileInfoModal: () => void;
  openAddNote: () => void;
  openEditNote: () => void;
  openViewAll: () => void;
  openAddFile: () => void;
  openViewAllFiles: () => void;
  openWarning: () => void;
  openClientEdit: () => void;
  setNotes: (note: Note) => void;
  setEditingFileId: (id: number | null) => void;
  setEditingFileInfoId: (id: number | null) => void;
  setNoteEdit: (note: editnoteDTO | null) => void;
  setNoteId: (id: number | null) => void;
  setTags: (tag: Tag[]) => void;
}
