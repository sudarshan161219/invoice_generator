import { type SetStateAction, type Dispatch, useState } from "react";
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
import { ListFilter, Tag, X } from "lucide-react";
import styles from "./index.module.css";

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
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    setFilters(tempFilters); // commit
    setOpen(false); // close popover
  };

  const handleClear = () => {
    const cleared: FilterState = {
      status: undefined,
      sortBy: "createdAt",
      sortOrder: "asc",
      tagIds: [],
    };
    setTempFilters(cleared);
    setFilters(cleared);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          <ListFilter size={14} /> Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className={styles.statusContainer}>
            {["active", "inactive", "prospect"].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  className="hover:cursor-pointer"
                  id={status}
                  checked={tempFilters.status === status}
                  onCheckedChange={(checked) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      status: checked
                        ? (status as FilterState["status"])
                        : undefined,
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
            value={tempFilters.sortBy ?? ""}
            onValueChange={(val) =>
              setTempFilters((prev) => ({
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

        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Select
            value={tempFilters.sortOrder ?? ""}
            onValueChange={(val) =>
              setTempFilters((prev) => ({
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
        {/* Tag Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Tag size={13} /> Tags
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <TagFilter
              availableTags={allTags}
              selectedTagIds={tempFilters.tagIds ?? []}
              onChange={(ids) =>
                setTempFilters((prev) => ({ ...prev, tagIds: ids }))
              }
            />
          </PopoverContent>
        </Popover>
        {/* Selected Tags Preview */}
        <div className={styles.tags}>
          {allTags
            .filter((tag) => tempFilters.tagIds?.includes(tag.id))
            .map((tag) => (
              <p
                key={tag.id}
                style={{ backgroundColor: `${tag.color}` }}
                className="border-r"
              >
                <span key={tag.id}>{tag.name}</span>
                <X className="hover:cursor-pointer" size={15} />
              </p>
            ))}
        </div>
        {/* Action Buttons */}
        <div className={styles.actionBtn}>
          <Button
            variant="ghost"
            size="md"
            onClick={handleClear}
            className="text-red-500"
          >
            Clear
          </Button>
          <Button size="md" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
