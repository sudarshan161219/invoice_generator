import { useState } from "react";
import { UploadCloud, Trash2, Pencil, File, Image } from "lucide-react";
import styles from "./index.module.css";
import { Button } from "@/components/button/Button";
import { uploadMultipleAttachments } from "../../api/uploadFile.client";
import { useInvoiceClient } from "@/hooks/useInvoiceClient";
import { toast } from "sonner";
import { ModalType } from "@/types/ModalType";
import { useNotesModal } from "@/hooks/useNotesModal";
import { stripExtension } from "@/lib/stripExtension";
import { EditFileInfoModal } from "./editFileInfoModal";

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
  const { editedName, activeModal, openModal, setEditedValue, setEditingId } =
    useNotesModal();
  const [uploadControllers, setUploadControllers] = useState<
    Record<string, AbortController>
  >({});
  const [dragOver, setDragOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<
    {
      id: number;
      name: string;
      progress: number;
      loaded: number;
      total: number;
    }[]
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

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const currentCount = uploadedFiles.length + uploadQueue.length;
    Array.from(files).forEach((file, index) => {
      if (currentCount + index >= MAX_FILES) {
        toast.warning(`You can only upload up to ${MAX_FILES} files.`);
        return;
      }
      if (!validateFile(file)) return;
      const id = parseInt(
        crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(0, 9)
      );

      const newFile: FileType = {
        id,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        file,
      };
      setUploadedFiles((prev) => [...prev, newFile]);
    });
  };

  const handleAttach = async () => {
    for (const file of uploadedFiles) {
      const controller = new AbortController();
      setUploadControllers((prev) => ({ ...prev, [file.id]: controller }));

      setUploadQueue((prev) => [
        ...prev,
        {
          id: file.id,
          name: file.name,
          progress: 0,
          loaded: 0,
          total: file.size,
        },
      ]);

      const formData = new FormData();
      const stripedVer = editedName ? editedName : stripExtension(file.name);
      const filename = stripedVer || "Untitled";
    
      formData.append("files", file.file);
      formData.append("type", file.type);
      formData.append("originalname", file.name);
      formData.append("filename", filename);
      if (client?.id) formData.append("clientId", client.id.toString());

      try {
        await uploadMultipleAttachments(
          formData,
          controller.signal,
          ({ percent, loaded, total }) => {
            setUploadQueue((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? { ...f, progress: percent, loaded, total }
                  : f
              )
            );
          }
        );

        setUploadQueue((prev) => prev.filter((f) => f.id !== file.id));
        toast.success(`${file.name} uploaded successfully`);
      } catch (err) {
        if (controller.signal.aborted) {
          toast.warning(`${file.name} upload canceled`);
        } else {
          toast.error(`Failed to upload ${file.name}`);
          console.error(err);
        }
      } finally {
        setUploadQueue((prev) => prev.filter((f) => f.id !== file.id));
        setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));
        setUploadControllers((prev) => {
          const copy = { ...prev };
          delete copy[file.id];
          return copy;
        });
      }
    }
    setUploadedFiles([]);
  };

  const editButtonFun = (fileName: string, fileId: number) => {
    const striptedExtension = stripExtension(fileName);
    setEditingId("fileName", fileId);
    setEditedValue("fileName", striptedExtension);
    openModal(ModalType.EditFileName);
  };

  const handleDelete = (id: number) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleRename = (id: number) => {
    if (!editedName) return;
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: editedName } : f))
    );
    console.log(uploadedFiles);
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    setUploadQueue([]);
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
          {uploadedFiles.map((file) => {
            const matchingUpload = uploadQueue.find((f) => f.id === file.id);
            const striptedExtension = stripExtension(file.name);
            return (
              <div key={file.id} className={styles.previewItem}>
                <div className={styles.item_action_container}>
                  {file.type.startsWith("image/") ? (
                    <div className={styles.fileInfoContainer}>
                      <Image className="text-[var(--label)]" />
                      <div>
                        <span className={styles.fileText}>
                          {striptedExtension}
                        </span>
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
                        <span className={styles.fileText}>
                          {striptedExtension}
                        </span>
                        <span className={styles.fileSize}>{`${(
                          file.size /
                          (1024 * 1024)
                        ).toFixed(2)} MB`}</span>
                      </div>
                    </div>
                  )}
                  <div className={styles.actions}>
                    {matchingUpload ? (
                      <button
                        className="text-red-500"
                        onClick={() => {
                          const controller = uploadControllers[file.id];
                          if (controller) {
                            controller.abort();
                          }
                        }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <div className={styles.actions}>
                        <button
                          onClick={() => editButtonFun(file.name, file.id)}
                          title="Rename"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {matchingUpload && (
                  <div className={styles.uploadList}>
                    <div className={styles.uploadItem}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${matchingUpload.progress}%` }}
                        />
                      </div>
                      <div className={styles.uploadStats}>
                        {`${(matchingUpload.loaded / (1024 * 1024)).toFixed(
                          2
                        )} MB / ${(
                          matchingUpload.total /
                          (1024 * 1024)
                        ).toFixed(2)} MB`}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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

      {activeModal === ModalType.EditFileName && (
        <EditFileInfoModal type="fileName" handleRename={handleRename} />
      )}

      {/* {activeModal === ModalType.EditFileName && (
        <EditFileModal handleRename={handleRename} />
      )} */}
    </div>
  );
};
