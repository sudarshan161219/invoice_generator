import { ClientInfo } from "../components/info/ClientInfo";
import { ClientInvoice } from "../components/invoice/ClientInvoice";
import { Modal } from "@/components/modal/Modal";
import styles from "./index.module.css";

export const ClientPage = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.box} ${styles.box1}`}>
        <ClientInfo />
      </div>
      <div className={`${styles.box} ${styles.box2}`}>
        <ClientInvoice />
      </div>

      <Modal />
    </div>
  );
};
