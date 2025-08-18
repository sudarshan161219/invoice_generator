import styles from "./index.module.css";
import { useState } from "react";
import { MoreHorizontal, Pencil, Trash, Dot, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/button/Button";
import { useModal } from "@/hooks/useModal";
import { AddNoteModal } from "@/components/addNoteModal/AddNoteModal";
import { useGetAllNotes } from "@/hooks/note/useGetAllNotes";
import type { ExtendedNoteDTO } from "@/types/note_types/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const ClientNotes = () => {
  const { openAddNote, openEditNote, isOpen, setNoteEdit, setNoteId } =
    useModal();
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);
  const { data, isLoading, error } = useGetAllNotes({ clientId });

  const onEdit = (
    noteId: number,
    title: string,
    content: string,
    label: {
      name: string;
      color: string;
    }
  ) => {
    const noteEdit = {
      title,
      content,
      label,
    };
    setNoteId(noteId);
    setNoteEdit(noteEdit);
    openEditNote();
    setOpenPopoverId(null);
  };

  const onCreate = () => {
    setNoteEdit(null);
    openAddNote();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading notes</div>;

  return (
    <div className={styles.container}>
      <div className={styles.btnContainer}>
        <Button
          onClick={onCreate}
          className={styles.addBtn}
          size="md"
          variant="outline"
        >
          <Plus size={16} /> Add Note
        </Button>
      </div>
      <div className={styles.grid}>
        {data.map((note: ExtendedNoteDTO) => {
          const date = new Date(note.createdAt);

          const formatted = date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "2-digit",
          });

          return (
            <div key={note.id} className={styles.noteCard}>
              <div className="flex flex-col ">
                <div className={styles.noteHeader}>
                  <span
                    className={styles.noteLabel}
                    style={{ color: note.label?.color }}
                  >
                    <Dot size={16} />
                    {note.label?.name}
                  </span>

                  <div className="relative overflow-hidden">
                    <Popover
                      open={openPopoverId === Number(note.id)}
                      onOpenChange={(open) => {
                        setOpenPopoverId(open ? Number(note.id) : null);
                      }}
                    >
                      <PopoverTrigger asChild>
                        <button className={styles.moreOptionsBtn}>
                          <MoreHorizontal size={18} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="bottom"
                        align="end"
                        className="w-25 p-0 "
                      >
                        <ul className={styles.options}>
                          <li
                            onClick={() =>
                              onEdit(
                                note.id,
                                note.title,
                                note.content,
                                note.label
                              )
                            }
                          >
                            <Pencil size={13} /> Edit
                          </li>
                          <li>
                            <Trash size={13} /> Delete
                          </li>
                        </ul>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className={styles.notesContentContainer}>
                  <h3 className={styles.noteHeading}>{note.title}</h3>
                  <p className={styles.noteContent}>{note.content}</p>
                </div>
              </div>

              <span className={styles.noteDate}>{formatted}</span>
            </div>
          );
        })}
      </div>

      {isOpen && <AddNoteModal />}
    </div>
  );
};
