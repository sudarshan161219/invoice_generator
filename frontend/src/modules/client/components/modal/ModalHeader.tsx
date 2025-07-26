import { CircleX } from "lucide-react";
import styles from "./index.module.css";

type Props = {
  mode: string;
  toggleModal: () => void;
};

export const ModalHeader = ({ mode, toggleModal }: Props) => {
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
