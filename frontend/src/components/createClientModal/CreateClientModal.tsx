import { useModal } from "@/hooks/useModal";
import { ClientForm } from "../clientForm/ClientForm";
import { X } from "lucide-react";
import styles from "./index.module.css";

export const CreateClientModal = () => {
  const { toggleModal } = useModal();
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <h1>New Client</h1>
            <p>Fill in the details to create and save a new client profile.</p>
          </div>

          <X onClick={toggleModal} className={styles.closeIcon} size={25} />
        </div>
        <ClientForm />
      </div>

      <div onClick={toggleModal} className={styles.modalBg}></div>
    </div>
  );
};
