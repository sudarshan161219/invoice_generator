import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/button/Button";
import { getFileIcon } from "@/lib/ConditionalIcons/getFileIcon";
import { truncateFileName } from "@/lib/truncate";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis, Upload, Pencil, ArrowDownToLine, Trash } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import styles from "./index.module.css";
import { handleOpenFile } from "../../../api/get.single.attachment.client.api";
import { handleDownloadFile } from "@/lib/api/attachment/get.single.attachment.client.api";
import { stripExtension } from "@/lib/stripExtension";
import { ModalType } from "@/types/ModalType";
import { useClient } from "@/hooks/useClient";

type Attachment = {
  id: number;
  filename: string;
  url: string;
  type: string;
  size: number;
};

interface ClientAttachmentsProps {
  attachments: Attachment[];
}

export const ClientAttachments = ({ attachments }: ClientAttachmentsProps) => {
  const navigate = useNavigate();
  const { setEditFileName, setEditFileId, fileID, openModal } = useModal();
  const { setClientId } = useClient();
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);

  const editButtonFun = (fileName: string, fileId: number) => {
    const striptedExtension = stripExtension(fileName);
    setEditFileId(fileId);
    setClientId(clientId);
    setEditFileName(striptedExtension);
    openModal("editFile", ModalType.EditFile);
    setOpenPopoverId(null);
  };

  const redirect = () => {
    navigate(`/attachments/${clientId}`);
  };
  const handleDeleteFile = (fileId: number) => {
    fileID(fileId);
    setClientId(clientId);
    openModal("warning", ModalType.Warning);
    setOpenPopoverId(null);
  };

  const handle_Open_File = (fileId: number) => {
    handleOpenFile(fileId);
    setOpenPopoverId(null);
  };

  if (!attachments?.length) {
    return (
      <div className={styles.attachmentsContainer}>
        <div className="flex items-center justify-between">
          <h3 className={styles.containerHeading}>Attachments</h3>
          <div className={styles.actionsbtns}>
            <Button
              variant="default"
              size="md"
              className={styles.actionbtn}
              onClick={() => openModal("addFile", ModalType.AddFile)}
            >
              <Upload size={12} />
              Add file
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">No attachments found.</p>
      </div>
    );
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  return (
    <div className={styles.attachmentsContainer}>
      <div className="flex items-center justify-between">
        <h3 className={styles.containerHeading}>Attachments</h3>

        <div className={styles.actionsbtns}>
          <Button
            variant="default"
            size="md"
            className={styles.actionbtn}
            onClick={() => openModal("addFile", ModalType.AddFile)}
          >
            <Upload size={12} />
            Upload File
          </Button>

          <Button
            className={styles.actionbtn}
            onClick={redirect}
            variant="ghost"
            size="md"
          >
            View files
          </Button>
        </div>
      </div>

      <div className={styles.attachmentList}>
        <ul>
          {attachments.map((file) => {
            const fullFileName = `${file.filename}.${file.type?.split("/")[1]}`;
            const fileType = file.type;
            return (
              <li key={file.id} className={styles.attachmentItem}>
                <div className={styles.attachmentInfo}>
                  {getFileIcon(fileType)}
                  <div>
                    <span
                      role="button"
                      onClick={() => handle_Open_File(file.id)}
                      className={styles.attachmentName}
                      title={file.filename}
                    >
                      {truncateFileName(file.filename)}
                    </span>

                    <p className="text-xs text-gray-500">
                      {file.type?.split("/")[1]?.toUpperCase() || "FILE"} ·{" "}
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <Popover
                  open={openPopoverId === Number(file.id)}
                  onOpenChange={(open) => {
                    setOpenPopoverId(open ? Number(file.id) : null);
                  }}
                >
                  <PopoverTrigger asChild>
                    <button className={styles.moreOptionsBtn}>
                      <Ellipsis size={18} />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    side="bottom"
                    align="end"
                    className="w-40 p-0"
                  >
                    <ul className={styles.moreMenu}>
                      <li
                        onClick={() =>
                          handleDownloadFile(file.id, fullFileName)
                        }
                      >
                        <ArrowDownToLine size={13} /> Download
                      </li>
                      <li onClick={() => editButtonFun(file.filename, file.id)}>
                        <Pencil size={13} /> Rename
                      </li>
                      <li
                        className=" text-red-600"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <Trash size={13} /> Delete
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
