import { Button } from "@/components/button/Button";
import { useNavigate } from "react-router-dom";
import { Pencil, FilePlus, Archive, Copy } from "lucide-react";
import type { Client } from "@/types/client";
import styles from "./index.module.css";
import { useState } from "react";

export const ClientHeader = ({
  client,
  clientName,
  bgGradient,
}: {
  client: Client;
  clientName: string;
  bgGradient: string;
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const openEditClient = () => {
    navigate(`/edit/${client.id}`);
  };

  const handleCopyInfo = async () => {
    await navigator.clipboard.writeText(
      `${clientName}\n${client.email}\n${client.phone}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // hide after 2s
  };

  return (
    <div className={styles.infoCard}>
      <div className={styles.imgConatiner}>
        <div
          className={styles.imgBanner}
          style={{ background: bgGradient }}
        ></div>
        <div className={styles.avatarImgContainer}>
          <img
            src={
              client.imageUrl ||
              `https://api.dicebear.com/7.x/lorelei/svg?seed=${clientName}`
            }
            alt={clientName}
            className={styles.avatarImg}
          />
        </div>
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
            <Button
              onClick={() => navigate(`/invoices/new?clientId=${client.id}`)}
              variant="outline"
              size="md"
              className={styles.button}
            >
              <FilePlus size={14} /> New Invoice
            </Button>
          </li>

          <li>
            <Button
              variant="outline"
              size="md"
              className={styles.button}
              onClick={handleCopyInfo}
            >
              <Copy size={14} /> {copied ? "Copied!" : "Copy Info"}
            </Button>
          </li>

          <li>
            <Button variant="danger" size="md" className={styles.button}>
              <Archive size={14} /> Archive
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};
