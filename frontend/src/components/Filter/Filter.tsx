import type { SetStateAction, Dispatch } from "react";
import { Button } from "@/components/button/Button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TagFilter } from "./TagFilter";

type FilterState = {
  status?: "active" | "inactive" | "prospect";
  sortBy?: "createdAt" | "name" | "email" | "company" | "status";
  sortOrder?: "asc" | "desc";
  tagIds?: number[];
};

interface AllTags {
  id: number;
  name: string;
  color: string;
  userId: number;
}

interface FilterPopoverProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  allTags: AllTags[];
}

export const Filter = ({
  filters,
  setFilters,
  allTags,
}: FilterPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filters</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 space-y-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex flex-col gap-2">
            {["active", "inactive", "prospect"].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={status}
                  checked={filters.status === status}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: checked
                        ? (status as FilterState["status"])
                        : "active",
                    }))
                  }
                />
                <Label htmlFor={status} className="capitalize">
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: val as FilterState["sortBy"],
              }))
            }
          >
            <SelectTrigger>
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
            value={filters.sortOrder}
            onValueChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                sortOrder: val as FilterState["sortOrder"],
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* <TagFilter
          availableTags={allTags}
          selectedTagIds={filters.tagIds ?? []}
          onChange={(ids) => setFilters((prev) => ({ ...prev, tagIds: ids }))}
        /> */}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Tags</Button>
          </PopoverTrigger>
          <PopoverContent>
            <TagFilter
              availableTags={allTags}
              selectedTagIds={filters.tagIds ?? []}
              onChange={(ids) =>
                setFilters((prev) => ({ ...prev, tagIds: ids }))
              }
            />
          </PopoverContent>
        </Popover>
      </PopoverContent>
    </Popover>
  );
};
