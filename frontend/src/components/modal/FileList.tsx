import {
  Paperclip,
  Ellipsis,
  Upload,
  Pencil,
  ArrowDownToLine,
  Trash,
} from "lucide-react";
import { useClientAttachments } from "@/hooks/attachment/useClientAttachments";
import { handleOpenFile } from "@/lib/api/attachment/get.single.attachment.client.api";
import { stripExtension } from "@/lib/stripExtension";
import { useNotesModal } from "@/hooks/useNotesModal";
import { useInvoiceClient } from "@/hooks/useInvoiceClient";
import { ModalType } from "@/types/ModalType";
import styles from "./index.module.css";

type Attachment = {
  id: number;
  filename: string;
  url: string;
  type: string;
  size: number;
};

export const FileList = () => {
  const { client, clientName, setClient, setClientName } = useInvoiceClient();
  const {
    openViewAllFiles,
    openAddFile,
    activeModal,
    openModal,
    setEditedValue,
    setEditingId,
    fileID,
    openWarning,
  } = useNotesModal();

  const {
    data: attachments,
    isLoading: isAttachmentsLoading,
    error: attachmentsError,
  } = useClientAttachments(client?.id ?? 0);

  if (isAttachmentsLoading)
    return <div className="p-4 text-gray-600">Loading client data...</div>;

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  const editButtonFun = (fileName: string, fileId: number) => {
    const striptedExtension = stripExtension(fileName);
    setEditingId("fileInfo", fileId);
    setEditedValue("fileInfo", striptedExtension);
    openModal(ModalType.EditFileInfo);
  };

  const handleDeleteFile = (fileId: number) => {
    fileID(fileId);
    openWarning();
  };

  return (
    <ul>
      {attachments.map((file: Attachment) => (
        <li key={file.id} className={styles.attachmentItem}>
          <div className={styles.attachmentInfo}>
            <Paperclip size={16} />

            <div>
              <span
                role="button"
                onClick={() => handleOpenFile(file.id)}
                className={styles.attachmentName}
                title={file.filename}
              >
                {file.filename}
              </span>

              <p className="text-xs text-gray-500">
                {file.type?.split("/")[1]?.toUpperCase() || "FILE"} ·{" "}
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => editButtonFun(file.filename, file.id)}
              className={styles.button}
            >
              <Pencil size={11} /> Edit
            </button>
            <button
              onClick={() => handleOpenFile(file.id)}
              className={styles.button}
            >
              <ArrowDownToLine size={13} /> Download
            </button>
            <button
              onClick={() => handleDeleteFile(file.id)}
              className={styles.Deletebutton}
            >
              <Trash size={12} /> Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
