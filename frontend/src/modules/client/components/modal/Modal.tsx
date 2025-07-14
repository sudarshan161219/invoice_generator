import styles from "./index.module.css";
import { useNotesModal } from "@/hooks/useNotesModal";
import { useState } from "react";
import { Pencil, Trash, CircleX, Upload } from "lucide-react";

type Note = {
  id: number;
  content: string;
  createdAt: string;
};

type File = {
  id: number;
  name: string;
  url: string;
};

type Props = {
  notes: Note[];
  files: File[];
  onEditNote: (id: number, newContent: string) => void;
  onAddFile: (file: File) => void;
};

export const Modal = ({ notes, files, onEditNote, onAddFile }: Props) => {
  const {
    isOpen,
    toggleNotesModal,
    mode,
    note, // selected note content
    setNotes,
  } = useNotesModal();

  const [editedContent, setEditedContent] = useState(note ?? "");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log("Hello");
  };

  const getHeadingText = () => {
    switch (mode) {
      case "add":
        return "Add Note";
      case "viewAll":
        return "Client Notes";
      case "addFile":
        return "Upload File";
      case "viewAllFiles":
        return "Client Files";
      default:
        return "";
    }
  };

  const renderView = () => {
    switch (mode) {
      case "viewAll":
        return (
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
        );

      case "add":
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a note..."
              rows={3}
            />
            <button type="submit">Add Note</button>
          </form>
        );

      case "viewAllFiles":
        return (
          <div>
            <ul>
              {files.map((file) => (
                <li key={file.id}>
                  <a href={file.url} target="_blank" rel="noreferrer">
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );

      case "addFile":
        return (
          <div>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const newFile: File = {
                    id: Date.now(),
                    name: file.name,
                    url: URL.createObjectURL(file),
                  };
                  onAddFile(newFile);
                  toggleNotesModal();
                }
              }}
            />
          </div>
        );

      default:
        return <p>Unknown modal mode.</p>;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h2>{getHeadingText()}</h2>
          <button onClick={toggleNotesModal}>
            <CircleX size={22} className={styles.icon} />
          </button>
        </div>
        {renderView()}
      </div>

      <div onClick={toggleNotesModal} className={styles.modalBg}></div>
    </div>
  );
};
