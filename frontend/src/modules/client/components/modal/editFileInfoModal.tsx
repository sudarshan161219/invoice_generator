import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { useNotesModal } from "@/hooks/useNotesModal";
import { updateAttachmentName } from "../../api/update.fileName.client.api";
import { toast } from "sonner";
import styles from "./index.module.css";

interface EditFileModalProps {
  type: "fileName" | "fileInfo";
  handleRename?: (id: number) => void;
}

export const EditFileInfoModal = ({
  type,
  handleRename,
}: EditFileModalProps) => {
  const {
    closeModal,
    editingFileId,
    editingFileInfoId,
    currentEditedValue,
    currentEditingId,
    setEditedValue,
    // editedName,
    editedFileInfoName,
  } = useNotesModal();

  const onSave = async () => {
    if (!currentEditingId) return;
    try {
      if (editingFileId) {
        handleRename?.(editingFileId);
      }

      if (editingFileInfoId) {
        await updateAttachmentName(editingFileInfoId, editedFileInfoName);
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error("Failed to save changes");
      // Optionally show an error toast or message here
    }
  };

  return (
    <div className={styles.editFileContainer}>
      <div className={styles.inputContainer}>
        <h3>Edit file name</h3>
        <Input
          value={currentEditedValue}
          type="text"
          placeholder="Enter new file name"
          onChange={(e) => setEditedValue(type, e.target.value)}
        />

        <div className={styles.editButtonContainer}>
          <Button onClick={closeModal} variant="outline" size="smMd">
            Cancel
          </Button>
          <Button onClick={onSave} size="smMd">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
