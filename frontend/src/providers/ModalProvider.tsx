import { useReducer, useState, type ReactNode } from "react";
import { ModalContext } from "../context/Modal-context";
import { ModalType } from "@/types/ModalType";
import {
  type Note,
  type UploadFileName,
  type EditFileName,
  type editnoteDTO,
  type Tag,
  type FileType,
  modalShortcuts,
} from "@/types/Modal";
import { useCategories } from "@/hooks/useCategories";

// ✅ Modal modes
type Mode =
  | "addNote"
  | "editNote"
  | "addFile"
  | "warning"
  | "manageCategories"
  | "editFile";

type State = {
  isOpen: boolean;
  isInnerModalOpen: boolean;
  activeModal?: ModalType;
  mode?: Mode;
  note: Note;
  noteEdit: editnoteDTO | null;
  noteId: number | null;
  fileId: number | number[] | null;
  uploadFileName: UploadFileName;
  editFileName: EditFileName;
  uploadFileId: number | null;
  editFileId: number | null;
  tags: Tag[];
  uploadedFiles: FileType[];
};

const initialState: State = {
  isOpen: false,
  isInnerModalOpen: false,
  activeModal: undefined,
  mode: undefined,
  note: "",
  noteEdit: null,
  noteId: null,
  fileId: null,

  uploadFileName: "",
  editFileName: "",
  uploadFileId: null,
  editFileId: null,
  tags: [],
  uploadedFiles: [],
};

function reducer(state: State, action: any): State {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        isOpen: true,
        activeModal: action.modal,
        mode: action.mode,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        isOpen: false,
        activeModal: undefined,
        mode: undefined,
      };
    case "SET_NOTE":
      return { ...state, note: action.payload };
    case "SET_NOTE_EDIT":
      return { ...state, noteEdit: action.payload };
    case "SET_NOTE_ID":
      return { ...state, noteId: action.payload };
    case "SET_FILE_ID":
      return { ...state, fileId: action.payload };

    case "SET_UPLOADFILE_ID":
      return { ...state, uploadFileId: action.payload };
    case "SET_EDITFILE_ID":
      return { ...state, editFileId: action.payload };

    case "SET_UPLOADFILE_NAME":
      return { ...state, uploadFileName: action.payload };
    case "SET_EDITFILE_NAME":
      return { ...state, editFileName: action.payload };

    case "SET_TAGS":
      return { ...state, tags: action.payload };

    case "RENAME_FILE":
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.map((f) =>
          f.id === action.payload.id ? { ...f, name: action.payload.name } : f
        ),
      };

    case "ADD_FILES":
      return {
        ...state,
        uploadedFiles: [...state.uploadedFiles, ...action.payload],
      };

    case "DELETE_FILE":
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.filter(
          (f) => f.id !== action.payload
        ),
      };

    case "CLEAR_UPLOADS":
      return {
        ...state,
        uploadedFiles: [],
      };

    default:
      return state;
  }
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isEditFileOpen, setIsEditFileOpen] = useState(false);

  // ✅ categories are handled separately
  const categoryState = useCategories([
    { id: 1, name: "VIP", color: "#ef4444", isDefault: true },
    { id: 2, name: "Regular", color: "#3b82f6", isDefault: true },
    { id: 3, name: "One-time", color: "#22c55e", isDefault: true },
  ]);

  // ---- Core actions ----
  const closeModal = () => dispatch({ type: "CLOSE_MODAL" });
  const openModal = (modal: ModalType, mode: Mode) =>
    dispatch({ type: "OPEN_MODAL", modal, mode });

  const toggleEditFile = () => setIsEditFileOpen((prev) => !prev);

  const renameFile = (id: number, name: string) => {
    dispatch({ type: "RENAME_FILE", payload: { id, name } });
  };

  const setUploadFileId = (id: number | null) =>
    dispatch({ type: "SET_UPLOADFILE_ID", payload: id });

  const setEditFileId = (id: number | null) =>
    dispatch({ type: "SET_EDITFILE_ID", payload: id });

  const setUploadFileName = (name: UploadFileName) =>
    dispatch({ type: "SET_UPLOADFILE_NAME", payload: name });

  const setEditFileName = (name: EditFileName) =>
    dispatch({ type: "SET_EDITFILE_NAME", payload: name });

  const addFiles = (files: FileType[]) =>
    dispatch({ type: "ADD_FILES", payload: files });

  // Delete a file
  const deleteFile = (id: number) =>
    dispatch({ type: "DELETE_FILE", payload: id });

  // Clear all uploads
  const clearUploads = () => dispatch({ type: "CLEAR_UPLOADS" });

  const closeEditFileModal = () => dispatch({ type: "CLOSE_EDIT_FILE_MODAL" });

  // Inside ModalProvider
  const open = Object.fromEntries(
    Object.entries(modalShortcuts).map(([key, { modal, mode }]) => [
      key,
      () => openModal(modal, mode),
    ])
  ) as {
    [K in keyof typeof modalShortcuts]: () => void;
  };

  return (
    <ModalContext.Provider
      value={{
        ...state,
        ...categoryState,

        // ---- Core ----
        closeModal,
        openModal,

        // ---- Shortcuts ----
        ...open,
        isEditFileOpen,
        toggleEditFile,
        closeEditFileModal,
        // ---- Notes ----
        setNotes: (note: Note) => dispatch({ type: "SET_NOTE", payload: note }),
        setNoteEdit: (note: editnoteDTO | null) =>
          dispatch({ type: "SET_NOTE_EDIT", payload: note }),
        setNoteId: (id: number | null) =>
          dispatch({ type: "SET_NOTE_ID", payload: id }),

        // ---- Files ----
        fileID: (id: number | number[]) =>
          dispatch({ type: "SET_FILE_ID", payload: id }),

        setUploadFileId,
        setEditFileId,

        setUploadFileName,
        setEditFileName,

        // ---- Misc ----
        setTags: (tags: Tag[]) => dispatch({ type: "SET_TAGS", payload: tags }),

        //----- Files ----
        renameFile,
        addFiles,
        deleteFile,
        clearUploads,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
