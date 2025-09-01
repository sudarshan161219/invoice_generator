import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { useModal } from "@/hooks/useModal";
import { useUpdateAttachment } from "@/hooks/attachment/useUpdateAttachment";
import styles from "./index.module.css";
import { useClient } from "@/hooks/useClient";

export const EditFileInfoModal = () => {
  const { editFileId, editFileName, setEditFileName, closeModal } = useModal();
  const { clientId } = useClient();

  const { mutate, isPending } = useUpdateAttachment(clientId);

  const onSave = () => {
    if (!editFileId || !editFileName.trim()) return;
    mutate({ id: editFileId, filename: editFileName });
  };

  const onClose = () => {
    setEditFileName("");
    closeModal();
  };

  return (
    <div className={styles.editFileContainer}>
      <div className={styles.inputContainer}>
        <h3>Edit file name</h3>
        <Input
          value={editFileName}
          type="text"
          placeholder="Enter new file name"
          onChange={(e) => setEditFileName(e.target.value)}
        />

        <div className={styles.editButtonContainer}>
          <Button onClick={onClose} variant="outline" size="md">
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
