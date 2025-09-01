import { type FC, type ReactElement, useMemo, useState } from "react";

import { Filter } from "@/components/Filter/Filter";
import { SearchInput } from "@/components/searchInput/SearchInput";
import { Table } from "@/components/table/Table";
import type { Column } from "@/types/table.types";
import { MoreVertical, Copy } from "lucide-react";
import type { Clients } from "../types/clients";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Button } from "@/components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { CreateClientModal } from "@/components/createClientModal/CreateClientModal";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllClients } from "@/hooks/client/useGetAllClients";
import { useModal } from "@/hooks/useModal";

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

type FilterState = {
  status?: "active" | "inactive" | "prospect";
  sortBy?: "createdAt" | "name" | "email" | "company" | "status";
  sortOrder?: "asc" | "desc";
  tagIds?: number[];
  search?: string;
};

export const ClientsPage: FC = (): ReactElement => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FilterState>({
    status: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
    tagIds: undefined,
    search: "",
  });

  const { isOpen, toggleModal } = useModal();
  const { data, isLoading, isError, error } = useGetAllClients({
    page: 1,
    limit: 10,
    ...filters,
  });

  const clients = data?.data;

  const allTags = useMemo(() => {
    return Array.from(
      new Map(
        clients?.data
          .flatMap((client) => client.tags ?? [])
          .map((tag) => [tag.id, tag])
      ).values()
    );
  }, [clients]);

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
      key: "invoices",
      title: "Invoices",
      render: () => (
        <div className="flex items-center">
          <span className="text-center w-full">0</span>
        </div>
      ),
    },

    {
      key: "actions",
      title: "Actions",
      render: () => (
        <div className=" ml-2">
          <button className=" hover:text-gray-800">
            <MoreVertical size={18} />
          </button>
        </div>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  if (clients?.data.length === 0) {
    return (
      <>
        <EmptyState
          title="No clients found"
          description="You haven’t added any clients yet. Start by creating one."
          buttonText="Create Client"
          redirectTo="/clients/new"
        />
        {isOpen && <CreateClientModal />}
      </>
    );
  }

  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      <div className="w-full flex flex-row justify-between">
        <div className={styles.inputSearchContainer}>
          <SearchInput
            placeholder="Search client"
            onDebouncedChange={handleSearch}
          />

          <Filter filters={filters} setFilters={setFilters} allTags={allTags} />
        </div>

        {/* create client modal Toggle */}
        <Button
          onClick={toggleModal}
          variant="default"
          size="md"
          className={styles.addBtn}
        >
          New Client
        </Button>
      </div>

      {isLoading ? (
        <p>Loading clients...</p>
      ) : (
        <Table
          data={clients?.data ?? []}
          columns={clientColumns}
          rowKey={(c) => c.id}
        />
      )}

      {clients && clients.meta.page >= 10 && (
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
      )}
      {isOpen && <CreateClientModal />}
    </div>
  );
};
