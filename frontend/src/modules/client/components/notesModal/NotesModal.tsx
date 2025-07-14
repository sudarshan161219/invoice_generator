import { useState } from "react";
import styles from "./index.module.css";
import { useNotesModal } from "@/hooks/useNotesModal";
import { Pencil, Trash, CircleX } from "lucide-react";

type Note = {
  id: number;
  content: string;
  createdAt: string;
};

type NotesModalProps = {
  notes: Note[];
  onAddNote: (content: string) => void;
  onDeleteNote: (id: number) => void;
  onEditNote: (id: number, newContent: string) => void;
};

export const NotesModal = ({
  notes,
  onAddNote,
  onDeleteNote,
  onEditNote,
}: NotesModalProps) => {
  const { toggleNotesModal, isOpen, mode } = useNotesModal();
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(newNote.trim());
    setNewNote("");
  };

  return (
    <div className={`${isOpen ? styles.modalContainer : "hidden"}`}>
      <div className={styles.card}>
        <div className={styles.modalHeader}>
          <h2>{mode === "add" ? "Add Note" : "Client Notes"}</h2>
          <button onClick={toggleNotesModal}>
            <CircleX size={22} className={styles.icon} />
          </button>
        </div>

        {/* Notes List */}
        {mode === "viewAll" && (
          <div className={styles.notesList}>
            {notes.length === 0 ? (
              <p>No notes yet.</p>
            ) : (
              <ul>
                {notes.map((note) => (
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
                            onClick={() => {
                              onEditNote(note.id, editedContent);
                              setEditingNoteId(null);
                            }}
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
                            {new Date(note.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
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
        )}

        {/* Add Note Form */}
        {mode === "add" && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a note..."
              rows={3}
            />
            <button type="submit">Add Note</button>
          </form>
        )}
      </div>

      <div onClick={toggleNotesModal} className={styles.modalBg}></div>
    </div>
  );
};
