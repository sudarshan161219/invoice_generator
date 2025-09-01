import { useContext } from "react";
import { ModalContext } from "@/context/Modal-context";
import type { ModalContextType } from "@/types/Modal";

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within an AuthProvider");
  return context;
};
