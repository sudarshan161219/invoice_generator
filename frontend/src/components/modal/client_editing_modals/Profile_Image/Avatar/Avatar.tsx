import { useState } from "react";
import { Button } from "@/components/button/Button";
import styles from "./index.module.css";

export const Avatar = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleRemove = () => {
    setPreview(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.avatarWrapper}>
        {preview ? (
          <img src={preview} alt="Avatar Preview" className={styles.avatar} />
        ) : (
          <div className={styles.placeholder}>No Avatar</div>
        )}
      </div>

      <div className={styles.actions}>
        {!preview ? (
          <label className={styles.uploadBtn}>
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </label>
        ) : (
          <>
            <label className={styles.editBtn}>
              Edit
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
            </label>
            <Button
              type="button"
              variant="danger"
              size="sm"
              className={styles.removeBtn}
              onClick={handleRemove}
            >
              Remove
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
