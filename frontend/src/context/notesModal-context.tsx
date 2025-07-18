import { createContext } from "react";

import type { NoteModalContextType } from "@/types/notesModal";

export const NotesModalContext = createContext<
  NoteModalContextType | undefined
>(undefined);
