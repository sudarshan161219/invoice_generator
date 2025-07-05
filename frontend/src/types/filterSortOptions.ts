import type { SortOption } from "./sortOptions";

export type FilterSortProps = {
  sortOptions: SortOption[];
  onSortChange: (value: string) => void;
  selectedSort: string;
};
