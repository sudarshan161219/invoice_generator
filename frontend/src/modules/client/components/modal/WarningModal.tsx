import { useState } from "react";
import { handleDeleteAttachments } from "../../api/delete.attachment.client.api";
import { useNotesModal } from "@/hooks/useNotesModal";
import styles from "./index.module.css";
import { Button } from "@/components/button/Button";

export const Warning = () => {
  const [loading, setLoading] = useState(false);
  const { fileId, toggleModal } = useNotesModal();
  const isBulk = Array.isArray(fileId) && fileId.length > 1;

  if (!fileId) return;

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await handleDeleteAttachments(fileId);
      console.log(res);
      if (res.result.success) {
        toggleModal();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.deleteModal}>
      <p className={styles.deleteModalPara}>
        Are you sure you want to delete {isBulk ? "these files" : "this file"}?
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-1 mt-2">
        <Button
          onClick={toggleModal}
          variant="outline"
          size="md"
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          className={styles.modalDeleteBtn}
          variant="default"
          size="md"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
};
