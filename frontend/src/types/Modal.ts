import { ModalType } from "@/types/ModalType";

export type Note = string;
export type UploadFileName = string;
export type EditFileName = string;

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

export type Category = {
  id: number;
  name: string;
  color: string;
  isDefault: boolean;
};

export type FileType = {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
  file: File;
};

// 🔹 Mode union
export type Mode =
  | "addNote"
  | "editNote"
  | "addFile"
  | "warning"
  | "manageCategories"
  | "editFile";

export interface ModalContextType {
  // ---- State ----
  note: Note;

  uploadFileName: UploadFileName;
  editFileName: EditFileName;

  noteEdit: editnoteDTO | null;
  noteId: number | null;
  fileId: number | number[] | null;

  uploadFileId: number | null;
  editFileId: number | null;

  isOpen: boolean;
  isInnerModalOpen: boolean;
  isEditFileOpen: boolean;

  activeModal?: ModalType;
  mode?: Mode;

  uploadedFiles: FileType[];
  renameFile: (id: number, name: string) => void;

  // ---- Data ----
  tags: Tag[];
  categories: Category[];

  // ---- Core Actions ----
  closeModal: () => void;
  openModal: (modalType: ModalType, mode: Mode) => void;
  closeEditFileModal: () => void;
  toggleEditFile: () => void;

  // ---- Shortcuts (match modalShortcuts keys) ----
  addNote: () => void;
  editNote: () => void;
  addFile: () => void;
  editFile: () => void;
  warning: () => void;
  manageCategories: () => void;

  // ---- Notes ----
  setNotes: (note: Note) => void;
  setNoteEdit: (note: editnoteDTO | null) => void;
  setNoteId: (id: number | null) => void;

  // ---- Files ----
  fileID: (id: number | number[]) => void;
  //-- Files edit/rename ----
  setUploadFileId: (id: number | null) => void;
  setEditFileId: (id: number | null) => void;

  setUploadFileName: (value: UploadFileName) => void;
  setEditFileName: (value: EditFileName) => void;

  // ---- Misc ----
  setTags: (tag: Tag[]) => void;

  addFiles: (files: FileType[]) => void;
  deleteFile: (id: number) => void;
  clearUploads: () => void;
}

// 🔹 Instead of defining separate methods, use a helper shortcuts object
export const modalShortcuts = {
  addNote: { modal: ModalType.AddNote, mode: "addNote" as Mode },
  editNote: { modal: ModalType.EditNote, mode: "editNote" as Mode },
  addFile: { modal: ModalType.AddFile, mode: "addFile" as Mode },
  warning: { modal: ModalType.Warning, mode: "warning" as Mode },
  editFileInfo: { modal: ModalType.EditFile, mode: "editFileInfo" as Mode },
  manageCategories: {
    modal: ModalType.ManageCategories,
    mode: "manageCategories" as Mode,
  },
};
