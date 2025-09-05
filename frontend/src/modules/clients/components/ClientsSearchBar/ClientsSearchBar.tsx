import { useState } from "react";
import { SearchInput } from "@/components/searchInput/SearchInput";
import { Filter } from "@/components/Filter/Filter";
import { FilterIcon } from "lucide-react";

type FilterState = {
  status?: "active" | "inactive" | "prospect";
  sortBy?: "createdAt" | "name" | "email" | "company" | "status";
  sortOrder?: "asc" | "desc";
  tagIds?: number[];
  search?: string;
};

interface AllTags {
  id: number;
  name: string;
  color: string;
  userId: number;
}

interface ClientsSearchBarProps {
  allTags: AllTags[];
  onFiltersChange: (filters: FilterState) => void;
}

export const ClientsSearchBar = ({
  allTags,
  onFiltersChange,
}: ClientsSearchBarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    status: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
    tagIds: undefined,
    search: "",
  });

  // propagate changes up to parent
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  return (
    <div className="mb-4">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between gap-4">
        <SearchInput
          placeholder="Search clients..."
          onDebouncedChange={(val) => updateFilters({ search: val })}
          //   className="w-1/3"
        />
        <Filter filters={filters} setFilters={setFilters} allTags={allTags} />
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col gap-2 md:hidden">
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search clients..."
            onDebouncedChange={(val) => updateFilters({ search: val })}
          />
          <button
            onClick={() => console.log("TODO: open filter modal/drawer")}
            className="p-2 rounded-md border border-gray-200 hover:bg-gray-100"
          >
            <FilterIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
