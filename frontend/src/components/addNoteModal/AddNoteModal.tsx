import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNotesModal } from "@/hooks/useNotesModal";
import { Button } from "@/components/button/Button";
import { Input } from "../input/Input";
import { ColorDropdown } from "../ColorDropdown/ColorDropdown";
import type { noteDTO } from "@/types/note_types/types";
import { Dot } from "lucide-react";
import { createNote } from "@/lib/api/note/create.note.api";
import styles from "./index.module.css";

export const AddNoteModal = () => {
  const { toggleModal } = useNotesModal();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [labelName, setLabelName] = useState("");
  const [labelColor, setLabelColor] = useState("#f97316");
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const noteData: noteDTO = {
      title,
      content,
      label: {
        name: labelName.trim() || "Untitled",
        color: labelColor,
      },
      noteType: "general",
      clientId: clientId,
    };
    await createNote(noteData);

    setTitle("");
    setContent("");
    setLabelName("");
    setLabelColor("#f97316");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={"Enter note title"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              rows={4}
              className="w-full border rounded-md p-2 border-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-[var(--ring)] focus:ring-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <div className="flex items-center gap-2">
              <Input
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
                placeholder={"e.g. Important"}
              />

              <ColorDropdown
                selectedColor={labelColor}
                onChange={(color) => setLabelColor(color)}
              />
            </div>
            {labelName && (
              <span className={styles.label} style={{ color: labelColor }}>
                <Dot size={20} /> {labelName}
              </span>
            )}
          </div>

          <div className={styles.btnContainer}>
            <Button
              size="md"
              variant="outline"
              type="button"
              onClick={toggleModal}
            >
              Cancel
            </Button>
            <Button size="md" variant="default" type="submit">
              Add Note
            </Button>
          </div>
        </form>
      </div>

      <div onClick={toggleModal} className={styles.modalBg}></div>
    </div>
  );
};
