import styles from "./index.module.css";
import { MoreHorizontal, Pencil, Trash, Dot, Plus } from "lucide-react";
import { Button } from "@/components/button/Button";
import { useNotesModal } from "@/hooks/useNotesModal";
import { AddNoteModal } from "@/components/addNoteModal/AddNoteModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const ClientNotes = () => {
  const { openAddNote, isOpen } = useNotesModal();

  const notes = [
    {
      id: 1,
      heading: "Invoice Split Request",
      label: "Important",
      content: "Client requested invoice split into Q3 and Q4.",
      date: "Jul 20, 25",
    },
    {
      id: 2,
      heading: "Monthly Reminder",
      label: "Reminder",
      content: "Send invoice by 5th of every month.",
      date: "Jul 10, 25",
    },
    {
      id: 3,
      heading: "Late Fee Follow-up",
      label: "Follow-up",
      content: "Ask about late fee policy agreement.",
      date: "Jul 05, 25",
    },
    {
      id: 4,
      heading: "Invoice Split Request",
      label: "Important",
      content: "Client requested invoice split into Q3 and Q4.",
      date: "Jul 20, 25",
    },
    {
      id: 5,
      heading: "Monthly Reminder",
      label: "Reminder",
      content: "Send invoice by 5th of every month.",
      date: "Jul 10, 25",
    },
    {
      id: 6,
      heading: "Late Fee Follow-up",
      label: "Follow-up",
      content: "Ask about late fee policy agreement.",
      date: "Jul 05, 25",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.btnContainer}>
        <Button
          onClick={openAddNote}
          className={styles.addBtn}
          size="md"
          variant="outline"
        >
          <Plus size={16} /> Add Note
        </Button>
      </div>
      <div className={styles.grid}>
        {notes.map((note) => (
          <div key={note.id} className={styles.noteCard}>
            <div className="flex flex-col ">
              <div className={styles.noteHeader}>
                <span className={styles.noteLabel}>
                  <Dot size={16} />
                  {note.label}
                </span>

                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className={styles.moreOptionsBtn}>
                        <MoreHorizontal size={18} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="bottom"
                      align="end"
                      className="w-25 p-0"
                    >
                      <ul className={styles.options}>
                        <li>
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
                <h3 className={styles.noteHeading}>{note.heading}</h3>
                <p className={styles.noteContent}>{note.content}</p>
              </div>
            </div>

            <span className={styles.noteDate}>{note.date}</span>
          </div>
        ))}
      </div>

      {isOpen && <AddNoteModal />}
    </div>
  );
};
