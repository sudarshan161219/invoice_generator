export const ModalType = {
  None: "none",
  EditFileName: "editFileName",
  EditFileInfo: "editFileInfo",
} as const;

export type ModalType = (typeof ModalType)[keyof typeof ModalType];
