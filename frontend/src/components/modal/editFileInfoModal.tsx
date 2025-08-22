import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { useModal } from "@/hooks/useModal";
import { useUpdateAttachment } from "@/hooks/attachment/useUpdateAttachment";
import { useInvoiceClient } from "@/hooks/useInvoiceClient";
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
    editedFileInfoName,
  } = useModal();
  const { client } = useInvoiceClient();

  // if (!client) return null;
  const { mutate, isPending } = useUpdateAttachment(client?.id ?? 0);

  const onSave = async () => {
    if (!currentEditingId) return;
    try {
      if (editingFileId) {
        handleRename?.(editingFileId);
      }

      if (editingFileInfoId) {
        mutate(
          { id: editingFileInfoId, filename: editedFileInfoName },
          {
            onError: (error) => {
              console.error("Mutation error:", error);
              toast.error("Failed to save changes");
            },
            onSuccess: () => {
              closeModal();
              toast.success("File name updated");
            },
          }
        );
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error("Failed to save changes");
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
          <Button onClick={closeModal} variant="outline" size="md">
            Cancel
          </Button>
          <Button onClick={onSave} size="md" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};
