import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClient } from "../../api/get.client.api";
import { getClientAttachments } from "../../api/getAttachments.client.api";
import { useInvoiceClient } from "@/hooks/useInvoiceClient";
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bgGradient] = useState(getRandomGradient());
  const note = dummyNotes[0];

  useEffect(() => {
    if (!id) return;

    const fetchClientAndAttachments = async () => {
      setLoading(true);
      try {
        const [clientRes, attachmentsRes] = await Promise.all([
          getClient(Number(id)),
          getClientAttachments(Number(id)),
        ]);

        setClient(clientRes.data);
        setClientName(clientRes.data.name);
        setData(attachmentsRes);
      } catch (err) {
        console.error("Failed to fetch client or attachments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientAndAttachments();
  }, [id, setClient, setClientName]);

  if (loading)
    return <div className="p-4 text-gray-600">Loading client data...</div>;
  if (!client) return <div className="p-4 text-red-500">Client not found.</div>;
  if (!data) return <div className="p-4 text-red-500">Data is empty.</div>;

  // console.log(data);

  return (
    <div className={styles.card}>
      <ClientHeader
        client={client}
        clientName={clientName}
        bgGradient={bgGradient}
      />
      <div className={styles.clientDetails}>
        <ClientNotes note={note} />
        <ClientAddress address={client.address || ""} />
        <ClientAttachments attachments={data} />
      </div>
    </div>
  );
};
