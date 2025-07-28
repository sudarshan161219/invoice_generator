import { ClientInfo } from "../components/info/ClientInfo";
import { ClientInvoice } from "../components/invoice/ClientInvoice";
// import { useNotesModal } from "@/hooks/useNotesModal";
import { Modal } from "../components/modal/Modal";
import styles from "./index.module.css";

const clientNotes = [
  {
    id: 1,
    content: "Send invoice after project completion",
    createdAt: "2025-07-10T14:00:00Z",
  },
  {
    id: 2,
    content: "Client prefers communication via WhatsApp.",
    createdAt: "2025-07-09T11:30:00Z",
  },
];

const clientFiles = [
  {
    id: 1,
    name: "client Doc",
    url: "http://www.google.com",
  },
  {
    id: 2,
    name: "client Doc",
    url: "http://www.google.com",
  },
];

export const ClientPage = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.box} ${styles.box1}`}>
        <ClientInfo />
      </div>
      <div className={`${styles.box} ${styles.box2}`}>
        <ClientInvoice />
      </div>

      <Modal
        notes={clientNotes}
        files={clientFiles}
        onEditNote={(id, content) => {
          console.log(id, content);
          // update note logic
        }}
      />
    </div>
  );
};
