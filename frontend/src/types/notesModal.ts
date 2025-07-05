export type Note = string;
export interface NoteModalContextType {
  note: Note;
  notesModal: boolean;
  toggleNotesModal: () => void;
  setNotes: (note: Note) => void;
}
