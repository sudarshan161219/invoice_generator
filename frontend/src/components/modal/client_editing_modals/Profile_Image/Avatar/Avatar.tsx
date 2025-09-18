import { useState } from "react";
import { Button } from "@/components/button/Button";
import { useUploadClientAvatar } from "@/hooks/client/useUploadClientAvatar";
import { usePersistentClientId } from "@/hooks/PersistValues/usePersistentClientId";
import styles from "./index.module.css";
import { toast } from "sonner";
import { useClient } from "@/hooks/useClient";
import { useModal } from "@/hooks/useModal";

export const Avatar = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { closeModal } = useModal();
  const { client } = useClient();
  const clientId = usePersistentClientId();
  const { mutate: uploadAvatar, isPending } = useUploadClientAvatar(clientId);

  // cache-buster based on updatedAt
  const cacheBuster = client?.updatedAt
    ? new Date(client.updatedAt).getTime()
    : Date.now();

  const avatarSrc =
    preview ||
    (client?.imageUrl ? `${client.imageUrl}?v=${cacheBuster}` : null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSave = () => {
    if (!file) return;

    uploadAvatar(file, {
      onSuccess: () => {
        setFile(null);
        setPreview(null); // clear preview so new image reloads
        toast.success("Client avatar updated successfully!");
        closeModal();
      },
      onError: (err) => {
        console.error("Failed to update client", err);
        toast.warning("Failed to update client");
      },
    });
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    // optionally: call an API to remove avatar from DB/Cloudinary
  };

  return (
    <div className={styles.container}>
      <div className={styles.avatarWrapper}>
        {avatarSrc ? (
          <img src={avatarSrc} alt="Avatar" className={styles.avatar} />
        ) : (
          <div className={styles.placeholder}>No Avatar</div>
        )}
      </div>

      <div className={styles.actions}>
        {!file ? (
          <label className={styles.uploadBtn}>
            {client?.imageUrl ? "Edit" : "Upload"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </label>
        ) : (
          <>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          </>
        )}

        {/* Show Remove only if avatar exists and no new file is selected */}
        {client?.imageUrl && !file && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            className={styles.removeBtn}
            onClick={handleRemove}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};
