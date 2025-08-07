import { Button } from "@/components/button/Button";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./index.module.css";
import { ReadMore } from "../readMore/ReadMore";
import { useNotesModal } from "@/hooks/useNotesModal";

export const ClientNotes = ({
  note,
}: {
  note: { content: string; createdAt: string };
}) => {
  const navigate = useNavigate();
  const { openAddNote, openViewAll } = useNotesModal();
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);
  if (!note) {
    return (
      <div className={styles.notesContainer}>
        <h3>Notes</h3>
        <p className={styles.emptyNote}>No notes yet.</p>
      </div>
    );
  }

  const redirect = () => {
    navigate(`/notes/${clientId}`);
  };

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
            onClick={redirect}
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
