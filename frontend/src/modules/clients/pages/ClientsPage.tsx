// components/ClientPage.tsx
import { type FC, type ReactElement, useEffect, useState } from "react";
import { FilterSort } from "@/components/FilterSort/FilterSort";
import { Tabs } from "../components/Tabs/Tabs";
import { SearchInput } from "@/components/searchInput/SearchInput";
import type { SortOption } from "@/types/sortOptions";
import { Table } from "@/components/table/Table";
import type { Column } from "@/types/table.types";
import { MoreVertical, Copy } from "lucide-react";
import type { Clients, ClientsApiResponse } from "../types/clients";
import { NotebookPen } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getAllClients } from "../api/getAll.clients.api";

function CopyButton({ value }: { value: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      console.log("Copied to clipboard:", value);
      // Optional: use toast("Copied!") here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
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

export const ClientsPage: FC = (): ReactElement => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  // const [notesModal, setNotesModal] = useState(false);
  // const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [clientResponse, setClientResponse] =
    useState<ClientsApiResponse | null>(null);

  const clientColumns: Column<Clients>[] = [
    {
      key: "name",
      title: "Name",
      render: (client) => (
        <Link className=" hover:underline " to={`/client/${client.id}`}>
          <div className="flex flex-row gap-2 items-center  ">
            <img
              src={`https://api.dicebear.com/7.x/lorelei/svg?seed=John%20Doe`}
              alt={"Skibiddi"}
              className="w-10 h-10 rounded-full"
            />
            <h1>{client.name}</h1>
          </div>
        </Link>
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

    // {
    //   key: "notes",
    //   title: "Notes",
    //   render: (client) => {
    //     return (
    //       <div className=" cursor-pointer">
    //         {client.notes && (
    //           <NotebookPen className="text-(--label)" size={16} />
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      key: "createdAt",
      title: "Created",
      render: (client) => new Date(client.createdAt).toLocaleDateString(),
    },

    { key: "invoices", title: "Invoices" },

    {
      key: "actions",
      title: "Actions",
      render: (client) => (
        <div className=" ml-2">
          <button className=" hover:text-gray-800">
            <MoreVertical size={18} />
          </button>
        </div>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    console.log("Searching clients for:", value);
    // Make API call or filter data here
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // trigger sorting logic here
    console.log("Sort by:", value);
  };

  useEffect(() => {
    getAllClients()
      .then((res) => {
        return setClientResponse(res);
      })
      .catch(console.error);
  }, []);

  const clientDataBlock = clientResponse?.data;
  const clients = clientDataBlock?.data;

  return (
    <div className="space-y-6">
      <div className="w-full flex flex-row justify-between">
        {/* <Tabs /> */}
        <SearchInput
          placeholder="Search client"
          onDebouncedChange={handleSearch}
        />
      </div>

      <Table
        data={clients ?? []}
        columns={clientColumns}
        rowKey={(c) => c.id}
      />

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
