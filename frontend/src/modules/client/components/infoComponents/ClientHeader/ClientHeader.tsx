import { Button } from "@/components/button/Button";
import { useNavigate } from "react-router-dom";
import { Pencil, FilePlus, UserX, Copy } from "lucide-react";
// import { useModal } from "@/hooks/useModal";
import type { Client } from "@/types/client";
import styles from "./index.module.css";

export const ClientHeader = ({
  client,
  clientName,
  bgGradient,
}: {
  client: Client;
  clientName: string;
  bgGradient: string;
}) => {
  // const { openClientEdit } = useModal();
  const navigate = useNavigate();

  const openEditClient = () => {
    navigate(`/edit/${client.id}`);
  };

  return (
    <div className={styles.infoCard}>
      <div className={styles.imgConatiner}>
        <div
          className={styles.imgBanner}
          style={{ background: bgGradient }}
        ></div>
        <img
          src={
            client.imageUrl ||
            `https://api.dicebear.com/7.x/lorelei/svg?seed=${clientName}`
          }
          alt={clientName}
          className={styles.avatarImg}
        />
      </div>

      <div className={styles.info}>
        <h1>{clientName}</h1>

        <ul className={styles.contactList}>
          <li>
            Email: {client.email} <Copy size={12} className={styles.copyIcon} />
          </li>
          <li>
            Phone: {client.phone} <Copy size={12} className={styles.copyIcon} />
          </li>
        </ul>

        <ul className={styles.actionsContainer}>
          <li>
            <Button
              onClick={openEditClient}
              variant="outline"
              size="md"
              className={styles.button}
            >
              <Pencil size={13} /> Edit
            </Button>
          </li>
          <li>
            <Button variant="outline" size="md" className={styles.button}>
              <FilePlus size={14} /> New invoice
            </Button>
          </li>
          <li>
            <Button variant="danger" size="md" className={styles.button}>
              <UserX size={14} /> Delete
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};
