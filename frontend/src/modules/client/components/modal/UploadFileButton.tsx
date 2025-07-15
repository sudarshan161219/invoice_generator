import { useState } from "react";
import { UploadCloud, X, Trash2, Pencil } from "lucide-react";
import styles from "./index.module.css";

type FileType = {
  id: number;
  name: string;
  url: string;
  type: string;
};

const MAX_SIZE_MB = 25;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export const UploadFileButton = () => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<
    { id: number; name: string; progress: number }[]
  >([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileType[]>([]);

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert(`Unsupported file: ${file.name}`);
      return false;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      alert(`File too large: ${file.name}`);
      return false;
    }
    return true;
  };

  const simulateUpload = (file: File) => {
    const id = Date.now() + Math.random();
    setUploadQueue((prev) => [...prev, { id, name: file.name, progress: 0 }]);

    const interval = setInterval(() => {
      setUploadQueue((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, progress: Math.min(f.progress + 10, 100) } : f
        )
      );
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const newFile: FileType = {
        id,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      };
      setUploadedFiles((prev) => [...prev, newFile]);
      setUploadQueue((prev) => prev.filter((f) => f.id !== id));
    }, 1100);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (validateFile(file)) simulateUpload(file);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDelete = (id: number) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleRename = (id: number) => {
    const newName = prompt("Enter new file name:");
    if (!newName) return;
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName } : f))
    );
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    setUploadQueue([]);
  };

  const handleAttach = () => {
    console.log("Final attached files:", uploadedFiles);
    // You can send `uploadedFiles` to parent or backend
  };

  return (
    <div className={styles.attachmentContainer}>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`${styles.uploadLabel} ${dragOver ? styles.dragOver : ""}`}
      >
        <UploadCloud size={85} className={styles.Uploadicon} />
        <div className={styles.textContainer}>
          <p>
            {dragOver ? "Drop files here" : "Click to Upload or drag and drop"}
          </p>
          <span>(Max 25MB | JPG, PNG, PDF)</span>
        </div>
        <input
          type="file"
          className="hidden"
          onChange={handleChange}
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
        />
      </label>

      {/* Uploading progress */}
      {uploadQueue.length > 0 && (
        <div className={styles.uploadList}>
          {uploadQueue.map((file) => (
            <div key={file.id} className={styles.uploadItem}>
              <span>{file.name}</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded previews */}
      {uploadedFiles.length > 0 && (
        <div className={styles.previewGrid}>
          {uploadedFiles.map((file) => (
            <div key={file.id} className={styles.previewItem}>
              {file.type.startsWith("image/") ? (
                <img src={file.url} alt={file.name} />
              ) : (
                <span className={styles.fileText}>{file.name}</span>
              )}
              <div className={styles.actions}>
                <button onClick={() => handleRename(file.id)} title="Rename">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(file.id)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      {uploadedFiles.length > 0 && (
        <div className={styles.actionsFooter}>
          <button onClick={handleCancel} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleAttach} className={styles.attachBtn}>
            Attach Files
          </button>
        </div>
      )}
    </div>
  );
};
