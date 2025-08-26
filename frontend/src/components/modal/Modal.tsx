import styles from "./index.module.css";
import { useModal } from "@/hooks/useModal";
import { ModalHeader } from "./ModalHeader";
import { NoteList } from "./NoteList";
import { AddNoteModal } from "@/components/addNoteModal/AddNoteModal";
import { EditModal } from "@/components/ClientModals/EditModal/EditModal";
import { UploadFileButton } from "./UploadFileButton";
import { Warning } from "./WarningModal";

export const Modal = () => {
  const { isOpen, toggleModal, mode } = useModal();

  if (!isOpen) return null;

  const renderView = () => {
    switch (mode) {
      case "viewAll":
        return <NoteList />;
      case "add":
        return <AddNoteModal />;
      case "clientEdit":
        return <EditModal />;
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
