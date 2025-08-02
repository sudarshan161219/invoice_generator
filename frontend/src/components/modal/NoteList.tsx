import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import styles from "./index.module.css";
// import type { Note } from "./types/types";

export const NoteList = () => {
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const onDeleteNote = (id: number) => {
    // placeholder for delete logic
    console.warn(id, "Define onDeleteNote");
  };

  const clientNotes = [
    {
      id: 1,
      content: "Send invoice after project completion",
      createdAt: "2025-07-10T14:00:00Z",
    },
    {
      id: 2,
      content: "Client prefers communication via WhatsApp.",
      createdAt: "2025-07-09T11:30:00Z",
    },
  ];

  return (
    <div className={styles.notesList}>
      {clientNotes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul>
          {clientNotes.map((note) => (
            <li key={note.id} className={styles.noteItem}>
              {editingNoteId === note.id ? (
                <>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={2}
                    className={styles.editInput}
                  />
                  <div className={styles.actions}>
                    <button
                    // onClick={() => {
                    //   onEditNote(note.id, editedContent);
                    //   setEditingNoteId(null);
                    // }}
                    >
                      Save
                    </button>
                    <button onClick={() => setEditingNoteId(null)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>{note.content}</p>
                  <div className={styles.noteFooter}>
                    <span>
                      {new Date(note.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <div className={styles.iconButtons}>
                      <button
                        title="Edit"
                        onClick={() => {
                          setEditingNoteId(note.id);
                          setEditedContent(note.content);
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this note?"
                            )
                          ) {
                            onDeleteNote(note.id);
                          }
                        }}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
