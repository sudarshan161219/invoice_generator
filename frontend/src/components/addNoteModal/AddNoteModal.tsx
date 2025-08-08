import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNotesModal } from "@/hooks/useNotesModal";
import { Button } from "@/components/button/Button";
import { Input } from "../input/Input";
import { ColorDropdown } from "../ColorDropdown/ColorDropdown";
import type { noteDTO } from "@/types/note_types/types";
import { Dot } from "lucide-react";
import styles from "./index.module.css";
// import { useCreateNote } from "@/hooks/note/useCreateNote";
// import { useUpdateNote } from "@/hooks/note/useUpdateNote";
import { useSaveNote } from "@/hooks/note/useSaveNote";
import { toast } from "sonner";

export const AddNoteModal = () => {
  const { toggleModal, noteEdit, noteId } = useNotesModal();
  const { mutate, isPending, isSuccess, isError, error } = useSaveNote();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [labelName, setLabelName] = useState("");
  const [labelColor, setLabelColor] = useState("#f97316");
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);

  useEffect(() => {
    if (noteEdit) {
      setTitle(noteEdit.title);
      setContent(noteEdit.content);
      setLabelName(noteEdit.label.name);
      setLabelColor(noteEdit.label.color);
    } else {
      setTitle("");
      setContent("");
      setLabelName("");
      setLabelColor("#f97316");
    }
  }, [noteEdit]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Something went wrong");
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Note added successfully!");
      toggleModal();
    }
  }, [isSuccess, toggleModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const data: noteDTO = {
      title,
      content,
      label: {
        name: labelName.trim() || "Untitled",
        color: labelColor,
      },
      noteType: "general",
      clientId: clientId,
      invoiceId: undefined,
    };
    mutate({
      noteId: noteEdit ? noteId : undefined, // only send noteId if editing
      data,
    });
    // if (isEditing) {
    //   updateNoteMutate({
    //     noteId: noteId,
    //     data,
    //   });
    // } else {
    //   mutate(data);
    // }
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
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              size="md"
              variant="default"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Adding note..." : "Add Note"}
              {/* {updating ? "Updating note..." : "Add Note"} */}
            </Button>
          </div>
        </form>
      </div>

      <div onClick={toggleModal} className={styles.modalBg}></div>
    </div>
  );
};
