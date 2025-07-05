import styles from "./index.module.css";
import { useNotesModal } from "@/hooks/useNotesModal";
// notesModal

export const NotesModal = () => {
  const { toggleNotesModal, note, notesModal } = useNotesModal();

  return (
    <div
      className={`${notesModal ? "flex" : " none"} ${styles.modalContainer}`}
    >
      <div className={styles.card}>
        <h1>{note}</h1>
        <button onClick={toggleNotesModal}>close</button>
      </div>
    </div>
  );
};
