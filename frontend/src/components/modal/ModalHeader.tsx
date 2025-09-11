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
        return "Upload and Attach File";
      case "viewAllFiles":
        return "Client Files";
      case "warning":
        return isBulk ? "Delete Attachments" : "Delete Attachment";

      // 🔹 General Info
      case "name":
        return "Edit Client Name";
      case "email":
        return "Edit Client Email";
      case "phone":
        return "Edit Phone Number";

      // 🔹 Contact / Company
      case "companyName":
        return "Edit Company Name";
      case "profileImage":
        return "Update Profile Image";

      // 🔹 Business Info
      case "website":
        return "Edit Website";
      case "taxId":
        return "Edit Tax ID";
      case "taxIdType":
        return "Select Tax ID Type";

      // 🔹 Addresses
      case "billingAddress":
        return "Edit Billing Address";
      case "shippingAddress":
        return "Edit Shipping Address";

      // 🔹 Extra
      case "socialLinks":
        return "Edit Social Links";
      case "category":
        return "Edit Categories";
      case "status":
        return "Update Client Status";

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
