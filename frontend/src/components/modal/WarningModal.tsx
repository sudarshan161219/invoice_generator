import { useModal } from "@/hooks/useModal";
import styles from "./index.module.css";
import { Button } from "@/components/button/Button";
import { useDeleteAttachment } from "@/hooks/attachment/useDeleteAttachment";
import { useInvoiceClient } from "@/hooks/useInvoiceClient";
import { toast } from "sonner";

export const Warning = () => {
  const { client } = useInvoiceClient();
  const { fileId, toggleModal } = useModal();
  const isBulk = Array.isArray(fileId) && fileId.length > 1;

  const {
    mutateAsync: deleteAttachment,
    isPending: isLoading,
    error,
  } = useDeleteAttachment(client?.id ?? 0);

  const handleDelete = async () => {
    try {
      if (fileId !== null) {
        await deleteAttachment(fileId);
      }
      toggleModal();
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
          onClick={toggleModal}
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
