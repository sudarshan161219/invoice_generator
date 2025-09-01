import { useModal } from "@/hooks/useModal";
import styles from "./index.module.css";
import { Button } from "@/components/button/Button";
import { useDeleteAttachment } from "@/hooks/attachment/useDeleteAttachment";
import { useClient } from "@/hooks/useClient";
import { toast } from "sonner";

export const Warning = () => {
  const {  clientId } = useClient();
  const { fileId, closeModal } = useModal();
  const isBulk = Array.isArray(fileId) && fileId.length > 1;

  const {
    mutateAsync: deleteAttachment,
    isPending: isLoading,
    error,
  } = useDeleteAttachment();

  const handleDelete = async () => {
    try {
      if (fileId !== null) {
        console.log("Deleting with clientId:", clientId, "fileId:", fileId);
        await deleteAttachment({ ids: fileId, clientId });
      }
      closeModal();
      toast.success("File deleted successfully");
    } catch (err) {
      toast.error("Failed to delete file");
      console.error("Delete failed:", err);
    }
  };

  if (!fileId) return;

  return (
    <div className={styles.deleteModal}>
      <p className={styles.deleteModalPara}>
        Are you sure you want to delete {isBulk ? "these files" : "this file"}?
        This action cannot be undone.
      </p>

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      )}

      <div className="flex justify-end gap-1 mt-2">
        <Button
          onClick={closeModal}
          variant="outline"
          size="md"
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button
          className={styles.modalDeleteBtn}
          variant="default"
          size="md"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
};
