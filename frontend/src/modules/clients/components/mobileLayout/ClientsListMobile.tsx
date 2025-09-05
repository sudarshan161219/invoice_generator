import { ChevronRight } from "lucide-react";
import type { Clients } from "../../types/clients";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

export const ClientsListMobile = ({ clients }: { clients: Clients[] }) => {
  const navigate = useNavigate();
  const handleClientClick = (id: number) => {
    sessionStorage.setItem("clientId", String(id));
    navigate(`/client/${id}`);
  };

  return (
    <div className="md:hidden space-y-3">
      {clients.map((client) => (
        <div
          key={client.id}
          className={`${styles.infoContainer} shadow-sm `}
          onClick={() => handleClientClick(client.id)}
        >
          <div className="flex items-center gap-1">
            <img
              src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${client.name}`}
              alt={client.name}
              className="w-10 h-10 rounded-full"
            />
            <div className={styles.clientInfo}>
              <h2 className="font-medium">
                {client.name.length > 20
                  ? client.name.slice(0, 20) + "…"
                  : client.name}
              </h2>
              <p>
                {client.email.length > 25
                  ? client.email.slice(0, 25) + "…"
                  : client.email}
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <ChevronRight size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};
