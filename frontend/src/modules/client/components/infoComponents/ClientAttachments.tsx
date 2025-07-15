import { Button } from "@/components/button/Button";
import { Paperclip, Ellipsis, Upload } from "lucide-react";
import { useNotesModal } from "@/hooks/useNotesModal";
import styles from "./index.module.css";

type Attachment = {
  id: number;
  fileName: string;
  fileUrl: string;
};

export const ClientAttachments = ({
  attachments,
}: {
  attachments: Attachment[];
}) => {
  const { openViewAllFiles, openAddFile } = useNotesModal();

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
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.attachmentName}
                >
                  {file.fileName}
                </a>
              </div>

              <button className={styles.moreOptionsBtn}>
                <Ellipsis size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
