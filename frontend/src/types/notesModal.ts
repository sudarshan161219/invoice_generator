export type Note = string;
export type EditedName = string;
export interface NoteModalContextType {
  note: Note;
  editedName: EditedName;
  editingFileId: string | null;
  isOpen: boolean;
  isEditOpen: boolean;
  mode: "add" | "viewAll" | "addFile" | "viewAllFiles";
  toggleNotesModal: () => void;
  toggleEditFileNameModal: () => void;
  openAddNote: () => void;
  openViewAll: () => void;
  openAddFile: () => void;
  openViewAllFiles: () => void;
  setNotes: (note: Note) => void;
  setEditFileName: (editedName: EditedName) => void;
  setEditingFileId: (id: string | null) => void;
}
