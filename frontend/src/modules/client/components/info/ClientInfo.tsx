import { useParams } from "react-router-dom";
import { useClient } from "@/hooks/useClient";
import { useGetClient } from "@/hooks/client/useGetClient";
import { useClientAttachments } from "@/hooks/attachment/useClientAttachments";

import {
  ClientHeader,
  ClientNotes,
  ClientAddress,
  ClientAttachments,
} from "../infoComponents/export";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { useGetAllNotes } from "@/hooks/note/useGetAllNotes";

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
  const clientId = Number(id);
  const { client, clientName, setClient, setClientName, setClientId } =
    useClient();
  const { data: notes, isLoading } = useGetAllNotes({ clientId });
  const {
    data: clientData,
    isLoading: isClientLoading,
    error: clientError,
  } = useGetClient(clientId);

  const {
    data,
    isLoading: isAttachmentsLoading,
    error: attachmentsError,
  } = useClientAttachments(clientId);

  const attachments = data?.attachments || [];
  const [bgGradient] = useState(getRandomGradient());
  const note = notes ? notes[0] : [];

  // Sync client state to global context
  useEffect(() => {
    if (clientData) {
      setClientId(clientData?.data.id);
      setClient(clientData?.data);
      setClientName(clientData?.data.name);
    }
  }, [clientData, setClient, setClientId, setClientName]);

  if (isClientLoading || isAttachmentsLoading)
    return <div className="p-4 text-gray-600">Loading client data...</div>;

  if (clientError || attachmentsError)
    return (
      <div className="p-4 text-red-500">
        Error: {clientError?.message || attachmentsError?.message}
      </div>
    );

  if (!client) return <div className="p-4 text-red-500">Client not found.</div>;

  return (
    <div className={styles.card}>
      <ClientHeader
        client={client}
        clientName={clientName}
        bgGradient={bgGradient}
      />
      <div className={styles.clientDetails}>
        {isLoading ? "loading notes..." : <ClientNotes note={note} />}
        {client.address && <ClientAddress address={client.address || ""} />}
        <ClientAttachments attachments={attachments || []} />
      </div>
    </div>
  );
};
