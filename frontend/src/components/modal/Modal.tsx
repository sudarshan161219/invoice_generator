import styles from "./index.module.css";
import { useModal } from "@/hooks/useModal";
import { ModalHeader } from "./ModalHeader";
import { AddNoteModal } from "@/components/addNoteModal/AddNoteModal";
import { UploadFileButton } from "./UploadFileButton";
import { Warning } from "./WarningModal";
import { ManageCategoriesModal } from "../ManageCategoriesModal/ManageCategoriesModal";
import { EditFileInfoModal } from "./editFileInfoModal";

export type Mode =
  | "addNote"
  | "editNote"
  | "addFile"
  | "warning"
  | "manageCategories"
  | "editFileName"
  | "editFileInfo";

export const Modal = () => {
  const { isOpen, mode, closeModal } = useModal();

  if (!isOpen) return null;

  const renderView = () => {
    switch (mode) {
      case "addNote":
        return <AddNoteModal />;
      case "manageCategories":
        return <ManageCategoriesModal />;
      case "addFile":
        return <UploadFileButton />;
      case "warning":
        return <Warning />;
      case "editFile":
        return <EditFileInfoModal  />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <ModalHeader mode={mode || ""} toggleModal={closeModal} />
        {renderView()}
      </div>
      <div onClick={closeModal} className={styles.modalBg}></div>
    </div>
  );
};
