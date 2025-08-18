import { CircleX } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import styles from "./index.module.css";

type Props = {
  mode: string;
  toggleModal: () => void;
};

export const ModalHeader = ({ mode, toggleModal }: Props) => {
  const { fileId } = useModal();
  const isBulk = Array.isArray(fileId) && fileId.length > 1;
  const getHeadingText = () => {
    switch (mode) {
      case "add":
        return "Add Note";
      case "viewAll":
        return "Client Notes";
      case "addFile":
        return "Upload and attach file";
      case "viewAllFiles":
        return "Client Files";
      case "warning":
        return isBulk ? "Delete Attachments" : "Delete Attachment";
      default:
        return "";
    }
  };

  return (
    <div className={styles.modalHeader}>
      <h2 className="font-bold text-[var( --primary)] ">{getHeadingText()}</h2>
      <button onClick={toggleModal}>
        <CircleX size={22} className={styles.icon} />
      </button>
    </div>
  );
};
