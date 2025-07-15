export type Note = {
  id: number;
  content: string;
  createdAt: string;
};

export type File = {
  id: number;
  name: string;
  url: string;
};

export type Props = {
  notes: Note[];
  files: File[];
  onEditNote: (id: number, newContent: string) => void;
  // onAddFile: (file: File) => void;
};
