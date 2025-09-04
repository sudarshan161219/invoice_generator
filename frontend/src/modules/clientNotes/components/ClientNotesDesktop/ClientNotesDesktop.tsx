import { useState } from "react";
import { MoreHorizontal, Pencil, Trash, Dot, Plus } from "lucide-react";
import { Checkbox } from "@/components/checkboxs/checkbox";
import { Button } from "@/components/button/Button";
import { useModal } from "@/hooks/useModal";
import { useGetAllNotes } from "@/hooks/note/useGetAllNotes";
import { usePersistentClientId } from "@/hooks/PersistValues/usePersistentClientId";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ExtendedNoteDTO } from "@/types/note_types/types";
import { ModalType } from "@/types/ModalType";
import styles from "./index.module.css";

export const ClientNotesDesktop = () => {
  const { setNoteEdit, setNoteId, addNote, openModal, warning } = useModal();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const [activeNote, setActiveNote] = useState<ExtendedNoteDTO | null>(null);

  const clientId = usePersistentClientId();
  const { data, isLoading, error } = useGetAllNotes({ clientId });

  const onEdit = (note: ExtendedNoteDTO) => {
    setNoteId(note.id);
    setNoteEdit({ title: note.title, content: note.content, label: note.label });
    openModal("addNote", ModalType.AddNote);
    setOpenPopoverId(null);
  };

  const onCreate = () => {
    setNoteEdit(null);
    addNote();
    openModal("addNote", ModalType.AddNote);
  };

  const toggleSelect = (id: number) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Button onClick={onCreate} className={styles.addBtn} size="md" variant="outline">
          <Plus size={16} /> Add Note
        </Button>

        {selectedIds.length > 0 && (
          <div className="flex gap-2">
            <Button size="sm" variant="danger" onClick={handleBulkDelete}>
              <Trash size={14} /> Delete
            </Button>
            <Button size="sm" onClick={selectAll} variant="outline">Select All</Button>
            <Button size="sm" onClick={clearAll} variant="outline">Clear</Button>
          </div>
        )}
      </div>

      {/* Split Pane */}
      <div className="grid grid-cols-3 gap-4 flex-1 overflow-hidden">
        {/* Notes list */}
        <div className="col-span-1 border rounded-lg overflow-y-auto">
          {data?.map((note) => {
            const formatted = new Date(note.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "2-digit",
            });

            return (
              <div
                key={note.id}
                onClick={() => setActiveNote(note)}
                className={`p-3 border-b cursor-pointer transition ${
                  activeNote?.id === note.id ? "bg-[var(--card)] ring-2 ring-blue-400" : "hover:bg-[var(--card)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Checkbox
                      checked={selectedIds.includes(note.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleSelect(note.id)}
                    />
                    <span className="flex items-center gap-1 text-sm font-medium" style={{ color: note.label?.color }}>
                      <Dot size={16} />
                      {note.label?.name}
                    </span>
                  </div>

                  <Popover open={openPopoverId === note.id} onOpenChange={(open) => setOpenPopoverId(open ? note.id : null)}>
                    <PopoverTrigger asChild>
                      <button className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal size={18} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="bottom" align="end" className="w-32 p-1">
                      <ul className="flex flex-col gap-1 text-sm">
                        <li className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer" onClick={() => onEdit(note)}>
                          <Pencil size={13} /> Edit
                        </li>
                        <li className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer" onClick={handleDeleteFile}>
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

        {/* Active note detail */}
        <div className="col-span-2 border rounded-lg p-4 overflow-y-auto">
          {activeNote ? (
            <>
              <h2 className="text-lg font-bold">{activeNote.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{activeNote.content}</p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 font-medium" style={{ color: activeNote.label?.color }}>
                  <Dot size={16} /> {activeNote.label?.name}
                </span>
                <span className="text-gray-400">{new Date(activeNote.createdAt).toLocaleDateString()}</span>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a note to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};
