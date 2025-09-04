import { useState, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash, Dot, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/checkboxs/checkbox";
import { Button } from "@/components/button/Button";
import { useModal } from "@/hooks/useModal";
import { useGetAllNotes } from "@/hooks/note/useGetAllNotes";
import { usePersistentClientId } from "@/hooks/PersistValues/usePersistentClientId";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ExtendedNoteDTO } from "@/types/note_types/types";
import { ModalType } from "@/types/ModalType";
import styles from "./index.module.css";
import { Label } from "recharts";

export const ClientNotesMobile = () => {
  const { setNoteEdit, setNoteId, addNote, openModal, warning } = useModal();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showText, setShowText] = useState(true);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const [mobileDetail, setMobileDetail] = useState<ExtendedNoteDTO | null>(
    null
  );

  const clientId = usePersistentClientId();
  const { data, isLoading, error } = useGetAllNotes({ clientId });

  const isAllSelected = selectedIds.length === data?.length;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowText(false);
      } else {
        setShowText(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onEdit = (
    noteId: number,
    title: string,
    content: string,
    label: { name: string; color: string }
  ) => {
    const noteEdit = { title, content, label };
    setNoteId(noteId);
    setNoteEdit(noteEdit);
    openModal("addNote", ModalType.AddNote);
    setOpenPopoverId(null);
  };

  const onCreate = () => {
    setNoteEdit(null);
    addNote();
    openModal("addNote", ModalType.AddNote);
  };

  const toggleSelect = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const selectAll = () => setSelectedIds(data.map((note) => note.id));
  const clearAll = () => setSelectedIds([]);
  const handleDeleteFile = () => warning();
  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      warning();
      setSelectedIds([]);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading notes</div>;

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {selectedIds.length > 0 && (
          <div className="flex gap-2">
            <Checkbox
              className={styles.checkBox}
              checked={isAllSelected}
              onChange={() => (isAllSelected ? clearAll() : selectAll())}
            />
            <button
              onClick={() => (isAllSelected ? clearAll() : selectAll())}
              className={styles.selectAllBtn}
            >
              {isAllSelected ? "Unselect all" : "Select all"}
            </button>
            {/* <Button size="sm" variant="danger" onClick={handleBulkDelete}>
              <Trash size={14} /> Delete
            </Button>

            <Button size="sm" onClick={clearAll} variant="outline">
              Clear
            </Button> */}
          </div>
        )}
      </div>

      {/* Notes list */}
      <div className="border rounded-lg overflow-y-auto">
        {data?.map((note) => {
          const formatted = new Date(note.createdAt).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "2-digit",
              year: "2-digit",
            }
          );

          return (
            <div
              key={note.id}
              onClick={() => setMobileDetail(note)}
              className="p-3 border-b cursor-pointer hover:bg-[var(--card)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Checkbox
                    checked={selectedIds.includes(note.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleSelect(note.id)}
                    className={styles.checkBox}
                  />
                  <span
                    className="flex items-center gap-1 text-sm font-medium"
                    style={{ color: note.label?.color }}
                  >
                    <Dot size={16} />
                    {note.label?.name}
                  </span>
                </div>

                <Popover
                  open={openPopoverId === note.id}
                  onOpenChange={(open) =>
                    setOpenPopoverId(open ? note.id : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <button
                      className="cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="bottom"
                    align="end"
                    className="w-32 p-1"
                  >
                    <ul className="flex flex-col gap-1 text-sm">
                      <li
                        className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={(e) => {
                          onEdit(note.id, note.title, note.content, note.label);
                          e.stopPropagation();
                        }}
                      >
                        <Pencil size={13} /> Edit
                      </li>
                      <li
                        className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={handleDeleteFile}
                      >
                        <Trash size={13} /> Delete
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </div>

              <h4 className="font-medium mt-2">{note.title}</h4>
              <span className="text-xs text-gray-500">{formatted}</span>
            </div>
          );
        })}
      </div>

      {/* Mobile modal */}
      {mobileDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center"
          onClick={() => setMobileDetail(null)}
        >
          <div
            className="bg-[var(--card)] rounded-lg w-11/12 max-w-md relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
              onClick={() => setMobileDetail(null)}
            >
              <X size={18} />
            </button>

            <div className="overflow-y-auto p-4">
              <h2 className={styles.detailHeading}>{mobileDetail.title}</h2>
              <p className="mt-2 text-sm text-[var(--label)] whitespace-pre-wrap">
                {mobileDetail.content}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span
                  className="flex items-center gap-1 font-medium"
                  style={{ color: mobileDetail.label?.color }}
                >
                  <Dot size={16} /> {mobileDetail.label?.name}
                </span>
                <span className="text-gray-400">
                  {new Date(mobileDetail.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <button onClick={onCreate} className={styles.addBtn}>
        <Plus size={16} />
        {showText && <span className="font-medium">Add Note</span>}
      </button>
    </div>
  );
};
