import { useState } from "react";
import { UploadCloud, Trash2, Pencil, File, Image } from "lucide-react";
import styles from "./index.module.css";
import { Button } from "@/components/button/Button";
import { uploadMultipleAttachments } from "../../api/uploadFile.client";
import { useInvoiceClient } from "@/hooks/useInvoiceClient";
import { toast } from "sonner";

type FileType = {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
  file: File;
};

const MAX_SIZE_MB = 25;
const MAX_FILES = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export const UploadFileButton = () => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<
    { id: number; name: string; progress: number }[]
  >([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileType[]>([]);
  const { client } = useInvoiceClient();

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.warning(`Unsupported file: ${file.name}`);
      return false;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      toast.warning(`File too large: ${file.name}`);
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
        size: file.size,
        file,
      };
      setUploadedFiles((prev) => [...prev, newFile]);
      setUploadQueue((prev) => prev.filter((f) => f.id !== id));
    }, 1100);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const currentCount = uploadedFiles.length + uploadQueue.length;
    Array.from(files).forEach((file, index) => {
      if (currentCount + index >= MAX_FILES) {
        toast.warning(`You can only upload up to ${MAX_FILES} files.`);
        return;
      }

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

  const handleAttach = async () => {
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("files", file.file);
      formData.append("type", file.type);
    });
    if (client?.id) formData.append("clientId", client?.id.toString());
    try {
      const response = await uploadMultipleAttachments(formData);
      console.log("Uploaded:", response);
    } catch (error) {
      console.error("Upload failed:", error);
    }
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
        <UploadCloud size={70} className={styles.Uploadicon} />
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
          disabled={uploadedFiles.length + uploadQueue.length >= MAX_FILES}
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

      {uploadedFiles.length > 0 && (
        <p className={styles.uploadStatusText}>
          {`Uploaded ${
            uploadedFiles.length + uploadQueue.length
          } of ${MAX_FILES} files`}
        </p>
      )}

      {/* Uploaded previews */}
      {uploadedFiles.length > 0 && (
        <div className={styles.previewGrid}>
          {uploadedFiles.map((file) => (
            <div key={file.id} className={styles.previewItem}>
              {file.type.startsWith("image/") ? (
                // <img src={file.url} alt={file.name} />
                <div className={styles.fileInfoContainer}>
                  <Image className="text-[var(--label)]" />
                  <div>
                    <span className={styles.fileText}>{file.name}</span>
                    <span className={styles.fileSize}>{`${(
                      file.size /
                      (1024 * 1024)
                    ).toFixed(2)} MB`}</span>
                  </div>
                </div>
              ) : (
                <div className={styles.fileInfoContainer}>
                  <File className="text-[var(--label)]" />
                  <div>
                    <span className={styles.fileText}>{file.name}</span>
                    <span className={styles.fileSize}>{`${(
                      file.size /
                      (1024 * 1024)
                    ).toFixed(2)} MB`}</span>
                  </div>
                </div>
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
          <Button variant="outline" size="md" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="md" onClick={handleAttach}>
            Attach Files
          </Button>
        </div>
      )}
    </div>
  );
};
