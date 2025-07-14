export type Note = string;
export interface NoteModalContextType {
  note: Note;
  isOpen: boolean;
  mode: "add" | "viewAll" | "addFile" | "viewAllFiles";
  toggleNotesModal: () => void;
  openAddNote: () => void;
  openViewAll: () => void;
  openAddFile: () => void;
  openViewAllFiles: () => void;
  setNotes: (note: Note) => void;
}
