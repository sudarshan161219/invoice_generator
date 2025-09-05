import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useGetAllClients } from "@/hooks/client/useGetAllClients";
import { ClientsTable } from "../components/desktopLayout/ClientsTable";
import { ClientsListMobile } from "../components/mobileLayout/ClientsListMobile";
import { SearchInput } from "@/components/searchInput/SearchInput";
import { Filter } from "@/components/Filter/Filter";
import { ClientsSearchBar } from "../components/ClientsSearchBar/ClientsSearchBar";
import { ClientsControls } from "../components/ClientsControlls/ClientsControlls";
import styles from "./index.module.css";

type FilterState = {
  status?: "active" | "inactive" | "prospect";
  sortBy?: "createdAt" | "name" | "email" | "company" | "status";
  sortOrder?: "asc" | "desc";
  tagIds?: number[];
  search?: string;
};

export const ClientsPage = () => {
  const [filters, setFilters] = useState<FilterState>({
    status: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
    tagIds: undefined,
    search: "",
  });

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

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-red-500">Failed to load clients</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen ">
      <div className={styles.inputSearchContainer}>
        {/* <SearchInput
          placeholder="Search client"
          onDebouncedChange={handleSearch}
        />

        <Filter filters={filters} setFilters={setFilters} allTags={allTags} /> */}
        <ClientsControls />
      </div>
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
          fixed bottom-6 right-6 z-50
          bg-blue-600 hover:bg-blue-700
          text-white rounded-full shadow-lg
          flex items-center gap-2 px-5 py-3 md:px-6 md:py-3
          transition-all duration-200
        "
        onClick={() => console.log("Open Add Client Modal")}
      >
        <Plus size={20} />
        <span className="hidden sm:inline">Add Client</span>
      </button>
    </div>
  );
};
