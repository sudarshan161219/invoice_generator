import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { useModal } from "@/hooks/useModal";
import styles from "./index.module.css";

export const EditFileModal = ({
  handleRename,
}: {
  handleRename: (id: string) => void;
}) => {
  const {
    toggleEditFileNameModal,
    editedName,
    editingFileId,
    setEditFileName,
    setEditingFileId,
  } = useModal();

  const onSave = () => {
    if (!editingFileId) return;
    handleRename(editingFileId);
    setEditingFileId(null);
    toggleEditFileNameModal();
  };

  return (
    <div className={styles.editFileContainer}>
      <div className={styles.inputContainer}>
        <h3>Edit file name</h3>
        <Input
          value={editedName}
          type="text"
          placeholder="Enter new file name"
          onChange={(e) => setEditFileName(e.target.value)}
        />

        <div className={styles.editButtonContainer}>
          <Button
            onClick={toggleEditFileNameModal}
            variant="outline"
            size="smMd"
          >
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
