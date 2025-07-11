import { Button } from "@/components/button/Button";
import { Paperclip, Ellipsis, Upload } from "lucide-react";
import styles from "./index.module.css";

type Attachment = {
  id: number;
  fileName: string;
  fileUrl: string;
};

export const ClientAttachments = ({ attachments }: { attachments: Attachment[] }) => (
  <div className={styles.attachmentsContainer}>
    <div className="flex items-center justify-between">
      <h3 className={styles.containerHeading}>Attachments</h3>
      <Button variant="outline" size="smMd" className={styles.button}>
        <Upload size={14} />
        Add file
      </Button>
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
