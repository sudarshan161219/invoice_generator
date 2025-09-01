import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const usePersistentClientId = () => {
  const { id } = useParams<{ id?: string }>();
  const [clientId, setClientId] = useState(0);

  useEffect(() => {
    if (id) {
      // Coming from URL → update storage
      const numericId = Number(id);
      setClientId(numericId);
      sessionStorage.setItem("clientId", String(numericId));
    } else {
      // No param → try from sessionStorage
      const stored = sessionStorage.getItem("clientId");
      if (stored) {
        setClientId(Number(stored));
      }
    }
  }, [id]);

  return clientId;
};
