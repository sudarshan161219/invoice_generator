import { Button } from "@/components/button/Button";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./index.module.css";
import { ReadMore } from "../../readMore/ReadMore";
import { useModal } from "@/hooks/useModal";
import { ModalType } from "@/types/ModalType";

type Note = {
  id: number;
  title: string;
  content: string;
  label: {
    name: string;
    color: string;
  };
  noteType: "general" | "other"; // extend with other possible note types if needed
  createdAt: string; // ISO date string
  clientId: number;
  userId: number;
  invoiceId: number | null;
};

export const ClientNotes = ({ note }: { note: Note }) => {
  const navigate = useNavigate();
  const { setNoteEdit, openModal } = useModal();
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

  const onCreate = () => {
    setNoteEdit(null);
    openModal("addNote", ModalType.AddNote);
  };

  return (
    <div className={styles.notesContainer}>
      <div className={styles.heading_actionsContainer}>
        <h3 className={styles.containerHeading}>Notes</h3>

        <div className={styles.actionsbtns}>
          <Button
            className={styles.actionbtn}
            onClick={onCreate}
            variant="default"
            size="md"
          >
            + Add Note
          </Button>
          <Button
            className={styles.actionbtn}
            onClick={redirect}
            variant="ghost"
            size="md"
          >
            View All
          </Button>
        </div>
      </div>

      <div className={styles.noteCard}>
        <div className={styles.noteHeader}>
          <h4 className={styles.noteTitle}>{note.title}</h4>
          <span
            className={styles.label}
            style={{ backgroundColor: note.label.color }}
          >
            {note.label.name}
          </span>
        </div>

        <div className={styles.noteMetaRow}>
          <p className={styles.noteMeta}>
            {new Date(note.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <ReadMore content={note.content} />
      </div>
    </div>
  );
};
