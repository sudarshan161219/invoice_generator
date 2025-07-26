import styles from "./index.module.css";
import { useNotesModal } from "@/hooks/useNotesModal";
import { ModalHeader } from "./ModalHeader";
import { NoteList } from "./NoteList";
import { AddNoteForm } from "./AddNoteForm";
import { FileList } from "./FileList";
import { UploadFileButton } from "./UploadFileButton";
import type { Props } from "../../types/types";

export const Modal = ({ notes, files, onEditNote }: Props) => {
  const { isOpen, toggleModal, mode } = useNotesModal();

  if (!isOpen) return null;

  const renderView = () => {
    switch (mode) {
      case "viewAll":
        return <NoteList notes={notes} onEditNote={onEditNote} />;
      case "add":
        return <AddNoteForm />;
      case "viewAllFiles":
        return <FileList files={files} />;
      case "addFile":
        return <UploadFileButton />;
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
