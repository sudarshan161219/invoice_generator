import { Button } from "@/components/button/Button";
import styles from "./index.module.css";
import { ReadMore } from "../readMore/ReadMore";
import { useNotesModal } from "@/hooks/useNotesModal";

export const ClientNotes = ({
  note,
}: {
  note: { content: string; createdAt: string };
}) => {
  const { openAddNote, openViewAll } = useNotesModal();
  if (!note) {
    return (
      <div className={styles.notesContainer}>
        <h3>Notes</h3>
        <p className={styles.emptyNote}>No notes yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.notesContainer}>
      <div className={styles.heading_actionsContainer}>
        <h3 className={styles.containerHeading}>Notes</h3>

        <div className={styles.actionsbtns}>
          <Button
            className={styles.actionbtn}
            onClick={openAddNote}
            variant="default"
            size="sm"
          >
            + Add Note
          </Button>
          <Button
            className={styles.actionbtn}
            onClick={openViewAll}
            variant="ghost"
            size="sm"
          >
            View All
          </Button>
        </div>
      </div>

      <ReadMore content={note.content} />
    </div>
  );
};
