import { useState } from "react";
import { X } from "lucide-react";
import styles from "./index.module.css";

export const ClientsControls = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    tagIds: [] as number[],
    category: "",
    currency: "",
    hasInvoices: "",
  });

  const handleChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  return (
    <div className="flex gap-2 items-center">
      {/* Search Button */}
      <button
        onClick={() => setSearchOpen(true)}
        className="p-2 rounded-lg border hover:bg-gray-100"
      >
        🔍
      </button>

      {/* Filter Button */}
      <button
        onClick={() => setFilterOpen(true)}
        className="p-2 rounded-lg border hover:bg-gray-100"
      >
        🧩
      </button>

      {/* Search Drawer (top) */}
      {searchOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSearchOpen(false)}
        >
          <div
            className={styles.searchModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="text"
                placeholder="Search client"
              />
              <X
                onClick={() => setSearchOpen(false)}
                className={styles.xIcon}
                size={20}
              />
            </div>
          </div>

          <div
            onClick={() => setSearchOpen(false)}
            className={styles.modalBg}
          ></div>
        </div>
      )}

      {/* Filter Drawer (right) */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="absolute top-0 right-0 h-full w-80 max-w-[90%] bg-[var(--card)] shadow-lg p-4 animate-slideIn overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setFilterOpen(false)}>✖</button>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="prospect">Prospect</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleChange("sortBy", e.target.value)}
                className="w-full border rounded px-2 py-1"
              >
                <option value="createdAt">Created Date</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="company">Company</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Sort Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleChange("sortOrder", e.target.value)}
                className="w-full border rounded px-2 py-1"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                placeholder="Category"
                className="w-full border rounded px-2 py-1"
                value={filters.category}
                onChange={(e) => handleChange("category", e.target.value)}
              />
            </div>

            {/* Currency */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Currency</label>
              <input
                type="text"
                placeholder="Currency (e.g. USD, INR)"
                className="w-full border rounded px-2 py-1"
                value={filters.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
              />
            </div>

            {/* Has Invoices */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Invoices</label>
              <select
                value={filters.hasInvoices}
                onChange={(e) => handleChange("hasInvoices", e.target.value)}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">All</option>
                <option value="yes">Has Invoices</option>
                <option value="no">No Invoices</option>
              </select>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Tags</label>
              <input
                type="text"
                placeholder="Tag IDs (comma separated)"
                className="w-full border rounded px-2 py-1"
                onChange={(e) =>
                  handleChange(
                    "tagIds",
                    e.target.value.split(",").map((id) => parseInt(id.trim()))
                  )
                }
              />
            </div>

            {/* Apply & Reset */}
            <div className="flex gap-2">
              <button
                className="flex-1 bg-blue-600 text-white py-2 rounded"
                onClick={() => setFilterOpen(false)}
              >
                Apply
              </button>
              <button
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded"
                onClick={() =>
                  setFilters({
                    status: "",
                    sortBy: "createdAt",
                    sortOrder: "desc",
                    tagIds: [],
                    category: "",
                    currency: "",
                    hasInvoices: "",
                  })
                }
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
