import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClient } from "../../api/get.client.api";
import { useInvoiceClient } from "@/hooks/useInvoiceClient";
import { Pencil } from "lucide-react";
import { FilePlus } from "lucide-react";
import { UserX } from "lucide-react";
import { Button } from "@/components/button/Button";
import { Copy } from "lucide-react";
import { useNotesModal } from "@/hooks/useNotesModal";
import styles from "./index.module.css";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getRandomGradient = () => {
  const angle = Math.floor(Math.random() * 360);
  const color1 = getRandomColor();
  const color2 = getRandomColor();
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
};

type ClientNote = {
  id: number;
  content: string;
  createdAt: string;
};

const dummyNotes: ClientNote[] = [
  {
    id: 1,
    content:
      "Client prefers payment via bank transfer only. Also mentioned that invoices should include PO number, and they usually approve them within 7 days. Follow up via email if no response. Loves clean PDF formatting with logo and totals highlighted.",
    createdAt: "2025-07-08T12:34:56Z",
  },
  {
    id: 2,
    content: "Send invoices on the 1st of every month.",
    createdAt: "2025-06-15T09:21:00Z",
  },
  {
    id: 3,
    content: "Met at design conference in Bangalore.",
    createdAt: "2025-05-22T17:12:34Z",
  },
];

export const ClientInfo = () => {
  const { id } = useParams<{ id: string }>();
  const { client, clientName, setClient, setClientName } = useInvoiceClient();
  const [loading, setLoading] = useState(false);
  const [bgGradient] = useState(getRandomGradient());
  const [notes] = useState<ClientNote[]>(dummyNotes);
  const { notesModal, toggleNotesModal } = useNotesModal();
  const [expanded, setExpanded] = useState(false);
  const note = dummyNotes[0];

  useEffect(() => {
    if (!id) return;

    const fetchClient = async () => {
      setLoading(true);
      try {
        const { data } = await getClient(Number(id));
        setClient(data);
        setClientName(data.name);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch client:", err);
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, setClient, setClientName]);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading client data...</div>;
  }

  if (!client) {
    return <div className="p-4 text-red-500">Client not found.</div>;
  }

  if (!note) {
    return (
      <div className={styles.notesContainer}>
        <h3>Notes</h3>
        <p className={styles.emptyNote}>No notes yet.</p>
      </div>
    );
  }

  const { name, email, phone, company, address, createdAt } = client;

  return (
    <div className={styles.card}>
      <div className={styles.infoCard}>
        <div className={styles.imgConatiner}>
          <div
            className={styles.imgBanner}
            style={{
              background: bgGradient,
              transition: "background 1s ease-in-out",
            }}
          ></div>
          <img
            src={
              client.imageUrl ||
              `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}`
            }
            alt={client.name}
            className={styles.avatarImg}
          />
        </div>

        <div className={styles.info}>
          <h1>{clientName}</h1>

          <ul className={styles.contactList}>
            <li>
              Email: {email} <Copy size={12} className={styles.copyIcon} />
            </li>
            <li>
              Phone: {phone} <Copy size={12} className={styles.copyIcon} />
            </li>
          </ul>

          <ul className={styles.actionsContainer}>
            <li>
              <Button variant="outline" size="smMd" className={styles.button}>
                <Pencil size={13} /> Edit
              </Button>
            </li>
            <li>
              <Button variant="outline" size="smMd" className={styles.button}>
                <FilePlus size={14} /> Create invoice
              </Button>
            </li>
            <li>
              <Button variant="danger" size="smMd" className={styles.button}>
                <UserX size={14} /> Delete client
              </Button>
            </li>

            {/* <li>Edit</li>
            <li>Create invoice</li>
            <li>Delete clientee</li> */}
          </ul>
        </div>
      </div>

      <div className={styles.clientDetails}>
        <div className={styles.notesContainer}>
          <h3>Notes</h3>

          <div className={styles.noteItem}>
            <p
              className={`${styles.noteContent} ${
                !notesModal ? styles.clamped : ""
              }`}
            >
              {note.content}
            </p>
            <span className={styles.noteDate}>
              {new Date(note.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>

            {note.content.length > 100 && (
              <button
                className={styles.readMore}
                onClick={() => toggleNotesModal()}
              >
                {notesModal ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>

        <div className={styles.addressContainer}>
          <h3>Address</h3>
          <p>{address}</p>
        </div>
      </div>
    </div>
  );
};
