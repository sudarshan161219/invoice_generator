import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClient } from "../api/get.client.api";
import { useInvoiceClient } from "@/hooks/useInvoiceClient";

export const ClientPage = () => {
  const { id } = useParams<{ id: string }>();
  const { clientName, setClient, setClientName } = useInvoiceClient();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchClient = async () => {
      setLoading(true);
      try {
        const response = await getClient(Number(id));
        setClient(response);
        setClientName(response.data.name);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch client:", err);
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, setClient, setClientName]);

  return <div>{loading ? "Loading" : clientName}</div>;
};
