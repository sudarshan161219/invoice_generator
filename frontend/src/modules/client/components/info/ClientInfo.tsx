import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClient } from "../../api/get.client.api";
import { useInvoiceClient } from "@/hooks/useInvoiceClient";
import { useNotesModal } from "@/hooks/useNotesModal";
import {
  ClientHeader,
  ClientNotes,
  ClientAddress,
  ClientAttachments,
} from "../infoComponents/export";
import styles from "./index.module.css";

const dummyNotes = [
  {
    id: 1,
    content: "Client prefers bank transfer...",
    createdAt: "2025-07-08T12:34:56Z",
  },
];

const dummyAttachments = [
  { id: 1, fileName: "contract.pdf", fileUrl: "/uploads/contract.pdf" },
  { id: 2, fileName: "mockup.jpg", fileUrl: "/uploads/mockup.jpg" },
];

const getRandomColor = () =>
  "#" +
  Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");

const getRandomGradient = () =>
  `linear-gradient(${Math.floor(
    Math.random() * 360
  )}deg, ${getRandomColor()}, ${getRandomColor()})`;

export const ClientInfo = () => {
  const { id } = useParams<{ id: string }>();
  const { client, clientName, setClient, setClientName } = useInvoiceClient();
  const [loading, setLoading] = useState(false);
  const [bgGradient] = useState(getRandomGradient());
  const { notesModal, toggleNotesModal } = useNotesModal();
  const note = dummyNotes[0];

  useEffect(() => {
    if (!id) return;

    const fetchClient = async () => {
      setLoading(true);
      try {
        const { data } = await getClient(Number(id));
        setClient(data);
        setClientName(data.name);
      } catch (err) {
        console.error("Failed to fetch client:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, setClient, setClientName]);

console.log(client)

  if (loading)
    return <div className="p-4 text-gray-600">Loading client data...</div>;
  if (!client) return <div className="p-4 text-red-500">Client not found.</div>;

  return (
    <div className={styles.card}>
      <ClientHeader
        client={client}
        clientName={clientName}
        bgGradient={bgGradient}
      />
      <div className={styles.clientDetails}>
        <ClientNotes
          note={note}
          notesModal={notesModal}
          toggleNotesModal={toggleNotesModal}
        />
        <ClientAddress address={client.address || ""} />
        <ClientAttachments attachments={dummyAttachments} />
      </div>
    </div>
  );
};
