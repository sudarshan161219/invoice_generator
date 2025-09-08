import { useMemo, useState } from "react";
import z from "zod";
import { Plus } from "lucide-react";
import { useGetAllClients } from "@/hooks/client/useGetAllClients";
import { ClientsTable } from "../components/desktopLayout/ClientsTable";
import { ClientsListMobile } from "../components/mobileLayout/ClientsListMobile";
import { ClientsControls } from "../components/ClientsControlls/ClientsControlls";
import { useModal } from "@/hooks/useModal";
import { ModalType } from "@/types/ModalType";
import { EmptyState } from "@/components/EmptyState/EmptyState";

const FilterSchema = z.object({
  status: z.enum(["active", "inactive", "prospect"]).optional(),
  sortBy: z
    .enum(["createdAt", "name", "email", "company", "status"])
    .default("createdAt"), // ✅ always defined
  sortOrder: z.enum(["asc", "desc"]).default("desc"), // ✅ always defined
  category: z.string().default(""),
  currency: z.string().default(""),
  hasInvoices: z.enum(["All", "yes", "no"]).default("All"), // ✅ always defined
  search: z.string().optional(),
  tagIds: z.array(z.number()).default([]),
});

type FilterState = {
  status?: "active" | "inactive" | "prospect"; // optional
  sortBy: "createdAt" | "name" | "email" | "company" | "status"; // required
  sortOrder: "asc" | "desc"; // required
  tagIds: number[]; // optional
  search?: string; // optional
  category: string; // required (defaults to "")
  currency: string; // required (defaults to "")
  hasInvoices: "All" | "yes" | "no"; // required
};

export const ClientsPage = () => {
  const [filters, setFilters] = useState<FilterState>(FilterSchema.parse({}));
  const { openModal } = useModal();

  const { data, isLoading, error } = useGetAllClients({
    page: 1,
    limit: 10,
    ...filters,
    noCache: true,
  });

  const clients = data?.data;

  const allTags = useMemo(() => {
    if (!clients) return [];
    return Array.from(
      new Map(
        clients?.data
          .flatMap((client) => client.tags ?? [])
          .map((tag) => [tag.id, tag])
      ).values()
    );
  }, [clients]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-red-500">Failed to load clients</p>
      </div>
    );
  }

  if (clients?.data.length === 0) {
    return (
      <EmptyState
        title="No clients found"
        description="Looks like you haven’t created any clientd yet."
        buttonText="Create client"
        mode="addClient"
        modeType={ModalType.AddClient}
      />
    );
  }



  return (
    <div className="relative min-h-screen ">
      <ClientsControls
        filters={filters}
        onFiltersChange={setFilters}
        allTags={allTags}
      />
      {/* Desktop Table */}
      <div className="hidden md:block">
        {isLoading ? (
          <p>Loading clients...</p>
        ) : (
          <ClientsTable clients={clients?.data ?? []} />
        )}
      </div>

      {/* Mobile List */}
      {isLoading ? (
        <p>Loading clients...</p>
      ) : (
        <ClientsListMobile clients={clients?.data ?? []} />
      )}

      {/* Floating Add Button */}
      <button
        className="
          fixed bottom-6 right-6 
          bg-blue-600 hover:bg-blue-700
          text-white rounded-full shadow-lg
          flex items-center gap-2 px-5 py-3 md:px-6 md:py-3
          transition-all duration-200 cursor-pointer
          "
        onClick={() => openModal("addClient", ModalType.AddClient)}
      >
        <Plus size={20} />
        <span className="hidden sm:inline">Add Client</span>
      </button>
    </div>
  );
};
