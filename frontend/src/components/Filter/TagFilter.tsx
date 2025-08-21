import React, { useState } from "react";
import { Check } from "lucide-react";
import { type ClientTag } from "@/types/clients_types/types";
import styles from "./index.module.css";
import { Input } from "../input/Input";

interface TagFilterProps {
  availableTags: ClientTag[];
  selectedTagIds: number[];
  onChange: (tagIds: number[]) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  availableTags,
  selectedTagIds,
  onChange,
}) => {
  const [search, setSearch] = useState("");

  const handleToggle = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  // Filter tags by search
  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`${styles.container} w-full max-w-sm`}>
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Filter by tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        // className="w-full rounded-md border px-3 py-2 text-sm focus:border-primary focus:outline-none"
      />

      {/* List */}
      <div className="mt-2 max-h-60 overflow-y-auto rounded-md border p-2">
        {filteredTags.length === 0 ? (
          <p className="p-2 text-sm text-gray-500">No tags found.</p>
        ) : (
          <div>
            <p className="px-2 pb-1 text-xs font-medium text-gray-500">Tags</p>
            <ul className="space-y-1">
              {filteredTags.map((tag) => (
                <li
                  key={tag.id}
                  onClick={() => handleToggle(tag.id)}
                  className={styles.ulList}
                >
                  {/* Checkbox */}
                  <div
                    className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                      selectedTagIds.includes(tag.id)
                        ? `${styles.checkBox}`
                        : "opacity-50"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </div>

                  {/* Tag name with color */}
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: tag.color ?? "#999" }}
                    />
                    {tag.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
