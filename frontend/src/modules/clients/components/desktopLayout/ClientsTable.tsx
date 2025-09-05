import { Table } from "@/components/table/Table";
import type { Column } from "@/types/table.types";
import { MoreVertical, Copy } from "lucide-react";
import type { Clients } from "../../types/clients";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "@/components/searchInput/SearchInput";
import { Filter } from "@/components/Filter/Filter";
import styles from "./index.module.css";

function CopyButton({ value }: { value: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-gray-400 hover:text-gray-600"
      title="Copy to clipboard"
    >
      <Copy size={16} />
    </button>
  );
}

export const ClientsTable = ({ clients }: { clients: Clients[] }) => {
  const navigate = useNavigate();
  const handleClientClick = (id: number) => {
    sessionStorage.setItem("clientId", String(id));
    navigate(`/client/${id}`);
  };

  const clientColumns: Column<Clients>[] = [
    {
      key: "name",
      title: "Name",
      render: (client) => (
        <button
          onClick={() => handleClientClick(client.id)}
          className="flex flex-row gap-2 items-center hover:underline hover:cursor-pointer"
        >
          <img
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${client.name}`}
            alt={client.name}
            className="w-10 h-10 rounded-full"
          />
          <h1>{client.name}</h1>
        </button>
      ),
    },
    { key: "company", title: "Company" },
    {
      key: "email",
      title: "Email",
      render: (client) => (
        <div className="flex items-center">
          <span>{client.email}</span>
          <CopyButton value={client.email} />
        </div>
      ),
    },
    {
      key: "phone",
      title: "Phone",
      render: (client) => (
        <div className="flex items-center">
          <span>{client.phone}</span>
          <CopyButton value={client.phone || ""} />
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "Created",
      render: (client) => new Date(client.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      title: "Actions",
      render: () => (
        <button className="ml-2 hover:text-gray-800">
          <MoreVertical size={18} />
        </button>
      ),
    },
  ];

  return <Table data={clients} columns={clientColumns} rowKey={(c) => c.id} />;
};
