import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/button/Button";
import {
  Paperclip,
  Ellipsis,
  Upload,
  Pencil,
  ArrowDownToLine,
  Trash,
} from "lucide-react";
import { useNotesModal } from "@/hooks/useNotesModal";
import styles from "./index.module.css";
import { handleOpenFile } from "../../api/get.single.attachment.client.api";

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
  const { openViewAllFiles, openAddFile } = useNotesModal();
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
  const [openUpward, setOpenUpward] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setOpenTooltipId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTooltip = (fileId: number) => {
    if (openTooltipId === fileId) {
      setOpenTooltipId(null);
    } else {
      setOpenTooltipId(fileId);

      // Wait for DOM to update
      setTimeout(() => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceNeeded = 120; // assume tooltip height ~120px
          setOpenUpward(spaceBelow < spaceNeeded);
        }
      }, 0);
    }
  };

  if (!attachments?.length) {
    return (
      <div className={styles.attachmentsContainer}>
        <div className="flex items-center justify-between">
          <h3 className={styles.containerHeading}>Attachments</h3>
          <div className={styles.actionsbtns}>
            <Button
              variant="default"
              size="sm"
              className={styles.actionbtn}
              onClick={openAddFile}
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
            size="sm"
            className={styles.actionbtn}
            onClick={openAddFile}
          >
            <Upload size={12} />
            Add file
          </Button>

          <Button
            className={styles.actionbtn}
            onClick={openViewAllFiles}
            variant="ghost"
            size="sm"
          >
            View files
          </Button>
        </div>
      </div>

      <div className={styles.attachmentList}>
        <ul>
          {attachments.map((file) => (
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
                  // onClick={() =>
                  //   setOpenTooltipId(openTooltipId === file.id ? null : file.id)
                  // }
                  ref={buttonRef}
                  onClick={() => toggleTooltip(file.id)}
                  className={styles.moreOptionsBtn}
                >
                  <Ellipsis size={18} />
                </button>

                {openTooltipId === file.id && (
                  <div
                    ref={tooltipRef}
                    className={`${
                      openUpward ? "bottom-full mb-2" : "top-full mt-2"
                    } ${styles.toolTip}`}
                  >
                    <button
                      onClick={() => console.log("Edit", file.id)}
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
                      onClick={() => console.log("Delete", file.id)}
                      className={styles.Deletebutton}
                    >
                      <Trash size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
