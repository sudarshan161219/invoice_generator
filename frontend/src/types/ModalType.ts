export const ModalType = {
  AddNote: "addNote",
  EditNote: "editNote",
  AddFile: "addFile",
  EditFile: "editFile",
  Warning: "warning",
  ManageCategories: "manageCategories",
} as const;

export type ModalType = (typeof ModalType)[keyof typeof ModalType];
