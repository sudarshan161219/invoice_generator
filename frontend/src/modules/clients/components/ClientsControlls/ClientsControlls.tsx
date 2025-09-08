import { useState } from "react";
import { z } from "zod";
import { ListFilter, Tag, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { SearchInput } from "@/components/searchInput/SearchInput";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import styles from "./index.module.css";

interface AllTags {
  id: number;
  name: string;
  color: string;
  userId: number | undefined;
}

// ✅ Define schema
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

// ✅ ensures defaults are applied in the type
export type FilterState = z.infer<typeof FilterSchema>;

type ClientsControlsProps = {
  filters: FilterState;
  onFiltersChange: (newFilters: FilterState) => void;
  allTags: AllTags[];
};

export const ClientsControls = ({
  filters,
  onFiltersChange,
  allTags,
}: ClientsControlsProps) => {
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  const [filterOpen, setFilterOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);

  // ✅ Generic handler
  const handleChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const applyFilters = () => {
    const parsed = FilterSchema.safeParse(tempFilters);
    if (parsed.success) {
      onFiltersChange(parsed.data); // ✅ send back to parent
      setFilterOpen(false);
    } else {
      console.error("Invalid filter state", parsed.error.format());
    }
  };

  const resetFilters = () => {
    const defaults = FilterSchema.parse({});
    setTempFilters(defaults);
    onFiltersChange(defaults); // ✅ reset parent too
  };

  return (
    <div className="mb-3">
      {/* Search + Filter button */}
      <div className={styles.searchFilterContainer}>
        <SearchInput
          placeholder="Search client"
          onDebouncedChange={handleSearch}
        />

        <Button
          onClick={() => setFilterOpen(true)}
          variant="outline"
          className="flex items-center gap-1"
        >
          <ListFilter size={14} />
          <span className="hidden md:block">Filters</span>
        </Button>

        <Button
          onClick={() => setTagsOpen(true)}
          variant="outline"
          className="flex items-center gap-1"
        >
          <Tag size={14} />
          <span className="hidden md:block">Tags</span>
        </Button>
      </div>

      {/* Filter Drawer */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className={styles.drawerContainer}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Filters</h2>
              <X
                onClick={() => setFilterOpen(false)}
                className={styles.xIcon}
                size={20}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={tempFilters.status ?? ""}
                onValueChange={(val) =>
                  handleChange("status", val as FilterState["status"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select
                value={tempFilters.sortBy}
                onValueChange={(val) =>
                  handleChange("sortBy", val as FilterState["sortBy"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created At</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Select
                value={tempFilters.sortOrder}
                onValueChange={(val) =>
                  handleChange("sortOrder", val as FilterState["sortOrder"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div>
              <Label className="mb-1">Category</Label>
              <Input
                type="text"
                placeholder="Category"
                value={tempFilters.category}
                onChange={(e) => handleChange("category", e.target.value)}
              />
            </div>

            {/* Currency */}
            <div>
              <Label className="mb-1">Currency</Label>
              <Input
                type="text"
                placeholder="Currency (e.g. USD, INR)"
                value={tempFilters.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
              />
            </div>

            {/* Has Invoices */}
            <div className="space-y-2">
              <Label className="mb-1">Invoices</Label>
              <Select
                value={tempFilters.hasInvoices}
                onValueChange={(val) =>
                  handleChange("hasInvoices", val as FilterState["hasInvoices"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="yes">Has Invoices</SelectItem>
                  <SelectItem value="no">No Invoices</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Footer */}
            <div className="flex gap-2 mt-6">
              <Button
                variant="default"
                size="md"
                className="flex-1"
                onClick={applyFilters}
              >
                Apply
              </Button>
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tags Drawer */}
      {tagsOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setTagsOpen(false)}
        >
          <div
            className={styles.tagsContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Tags</h2>
              <X
                onClick={() => setTagsOpen(false)}
                className={styles.xIcon}
                size={20}
              />
            </div>

            <div className={styles.allTagsContainer}>
              {allTags.map((tag) => {
                const active = filters.tagIds?.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        tagIds: active
                          ? filters.tagIds.filter((id) => id !== tag.id)
                          : [...(filters.tagIds ?? []), tag.id],
                      })
                    }
                    className={`${styles.tag} ${
                      active ? styles.active : styles.inactive
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
