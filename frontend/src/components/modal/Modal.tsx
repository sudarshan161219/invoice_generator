import styles from "./index.module.css";
import { useNotesModal } from "@/hooks/useNotesModal";
import { ModalHeader } from "./ModalHeader";
import { NoteList } from "./NoteList";
import { AddNoteForm } from "./AddNoteForm";
import { UploadFileButton } from "./UploadFileButton";
import { Warning } from "./WarningModal";
// import type { Props } from "./types/types";

export const Modal = () => {
  const { isOpen, toggleModal, mode } = useNotesModal();

  if (!isOpen) return null;

  const renderView = () => {
    switch (mode) {
      case "viewAll":
        return <NoteList />;
      case "add":
        return <AddNoteForm />;
      case "addFile":
        return <UploadFileButton />;
      case "warning":
        return <Warning />;
      default:
        return <p>Unknown modal mode.</p>;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <ModalHeader mode={mode} toggleModal={toggleModal} />
        {renderView()}
      </div>
      <div onClick={toggleModal} className={styles.modalBg}></div>
    </div>
  );
};
