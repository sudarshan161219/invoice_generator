import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { useModal } from "@/hooks/useModal";
import { toast } from "sonner";
import styles from "./index.module.css";

export const FileNameInput = () => {
  const {
    uploadFileId,
    setUploadFileName,
    renameFile,
    uploadFileName,
    toggleEditFile,
  } = useModal();

  const onSave = async () => {
    try {
      if (uploadFileId != null) {
        renameFile(uploadFileId, uploadFileName);
        toggleEditFile();
      }

      toast.success("File renamed");
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
          value={uploadFileName}
          type="text"
          placeholder="Enter new file name"
          onChange={(e) => setUploadFileName(e.target.value)}
        />

        <div className={styles.editButtonContainer}>
          <Button onClick={toggleEditFile} variant="outline" size="md">
            Cancel
          </Button>
          <Button onClick={onSave} size="md">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
