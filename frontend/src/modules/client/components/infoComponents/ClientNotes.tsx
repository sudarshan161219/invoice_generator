import styles from "./index.module.css";

export const ClientNotes = ({
  note,
  notesModal,
  toggleNotesModal,
}: {
  note: { content: string; createdAt: string };
  notesModal: boolean;
  toggleNotesModal: () => void;
}) => {
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
      <h3 className={styles.containerHeading}>Notes</h3>

      <div className={styles.noteItem}>
        <p
          className={`${styles.noteContent} ${
            !notesModal ? styles.clamped : ""
          }`}
        >
          {note.content}
        </p>
        <span className={styles.noteDate}>
          {new Date(note.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>

        {note.content.length > 100 && (
          <button className={styles.readMore} onClick={toggleNotesModal}>
            {notesModal ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
};
