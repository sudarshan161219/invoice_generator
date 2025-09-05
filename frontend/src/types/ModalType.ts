export const ModalType = {
  AddNote: "addNote",
  EditNote: "editNote",
  AddFile: "addFile",
  EditFileName: "editFileName",
  Warning: "warning",
  ManageCategories: "manageCategories",
  AddClient: "addClient"
} as const;

export type ModalType = (typeof ModalType)[keyof typeof ModalType];
